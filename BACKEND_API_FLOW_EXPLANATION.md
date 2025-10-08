# eGovSA Backend & API Flow Documentation

## 🏗️ Architecture Overview

The application uses a **hybrid architecture** with two databases working together:

1. **Java Spring Boot Backend** (Port 8080) - Business logic & profile updates
2. **Supabase PostgreSQL** - Primary data storage & authentication
3. **React Native Frontend** - Mobile app (Expo)

Both the Java backend and Supabase connect to the **same PostgreSQL database**, ensuring data consistency.

---

## 📊 Database Architecture

### Single Source of Truth
```
┌─────────────────────────────────────┐
│     PostgreSQL Database             │
│     (Hosted on Supabase)            │
│                                     │
│  ┌──────────────────────────────┐  │
│  │    profiles table            │  │
│  │  - id (UUID)                 │  │
│  │  - email                     │  │
│  │  - phone                     │  │
│  │  - id_number                 │  │
│  │  - first_name, last_name     │  │
│  │  - gender, date_of_birth     │  │
│  │  - residential_address       │  │
│  │  - postal_address            │  │
│  │  - pin (hashed)              │  │
│  │  - created_at, updated_at    │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
         ▲                    ▲
         │                    │
         │                    │
    ┌────┴────┐         ┌────┴────┐
    │ Java    │         │ Supabase│
    │ Backend │         │ Client  │
    └─────────┘         └─────────┘
```

---

## 🔄 Complete API Flow

### 1️⃣ User Login Flow (PIN-based Authentication)

```
Mobile App → PIN Entry
     │
     ├─ Step 1: Verify PIN locally (SecureStore)
     │
     ├─ Step 2: Store email in SecureStore
     │
     └─ Step 3: Fetch profile from Supabase
          │
          └─→ Supabase RPC: get_profile_by_email(email)
               │
               └─→ Returns full profile (bypasses RLS with SECURITY DEFINER)
                    │
                    └─→ AuthContext stores user profile
```

**Why Supabase RPC?**
- Direct queries are blocked by Row Level Security (RLS)
- RPC function has `SECURITY DEFINER` privilege
- Allows PIN-based auth without Supabase Auth

---

### 2️⃣ Profile Update Flow

```
User updates profile in app
     │
     ├─ Frontend: personal-info.tsx
     │    └─→ Calls updateProfile(userId, data)
     │
     ├─ API Layer: api.ts
     │    └─→ PUT http://localhost:8080/api/profile/{userId}
     │         └─→ Sends JSON with camelCase fields:
     │             {
     │               "idNumber": "7008020291080",
     │               "phone": "0614849344",
     │               "firstName": "John",
     │               "gender": "Male"
     │             }
     │
     ├─ Java Backend: ProfileController.java
     │    └─→ @PutMapping("/{userId}")
     │         └─→ Receives Profile object (Jackson auto-converts)
     │              └─→ Logs incoming data
     │
     ├─ Service Layer: ProfileService.java
     │    └─→ updateProfile(UUID id, Profile updatedProfile)
     │         └─→ Finds existing profile by ID
     │         └─→ Updates non-null fields
     │         └─→ Sets updatedAt = LocalDateTime.now()
     │         └─→ Saves to database
     │
     ├─ JPA/Hibernate Layer
     │    └─→ Converts Java object to SQL
     │         └─→ UPDATE profiles SET 
     │              id_number = '7008020291080',
     │              phone = '0614849344',
     │              updated_at = NOW()
     │              WHERE id = 'uuid'
     │
     └─ PostgreSQL Database
          └─→ Data saved in snake_case columns
               (id_number, date_of_birth, etc.)
```

---

### 3️⃣ Profile Refresh Flow

```
After save, frontend refreshes profile
     │
     ├─ Frontend: personal-info.tsx
     │    └─→ Waits 1 second for DB to update
     │    └─→ Calls refreshUser()
     │
     ├─ AuthContext: refreshUser()
     │    └─→ Gets email from SecureStore
     │    └─→ Calls fetchUserProfileByEmail(email)
     │
     ├─ Supabase Client
     │    └─→ supabase.rpc('get_profile_by_email', { p_email: email })
     │
     ├─ Supabase RPC Function (SQL)
     │    └─→ SELECT * FROM profiles WHERE email = p_email
     │         └─→ Runs with SECURITY DEFINER (bypasses RLS)
     │
     └─ Returns profile in snake_case
          └─→ {
               "id_number": "7008020291080",
               "phone": "0614849344",
               "first_name": "John",
               "date_of_birth": "1990-01-01"
              }
          └─→ AuthContext updates user state
               └─→ Profile screen re-renders with new data
```

---

## 🔑 Key Components Explained

### Backend Components

#### 1. **Profile Entity** (`Profile.java`)
```java
@Entity
@Table(name = "profiles")
public class Profile {
    @Column(name = "id_number")  // Maps to database column
    private String idNumber;     // Java camelCase field
    
    // JPA/Hibernate handles the mapping:
    // Java: idNumber ↔ Database: id_number
}
```

**Purpose:** Represents the database table structure in Java

#### 2. **Profile Service** (`ProfileService.java`)
```java
public Profile updateProfile(UUID id, Profile updatedProfile) {
    return profileRepository.findById(id)
        .map(existingProfile -> {
            // Only update non-null fields
            if (updatedProfile.getIdNumber() != null) {
                existingProfile.setIdNumber(updatedProfile.getIdNumber());
            }
            existingProfile.setUpdatedAt(LocalDateTime.now());
            return profileRepository.save(existingProfile);
        })
        .orElseThrow(() -> new RuntimeException("Profile not found"));
}
```

**Purpose:** Business logic layer - handles partial updates and validation

#### 3. **Profile Controller** (`ProfileController.java`)
```java
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    @PutMapping("/{userId}")
    public ResponseEntity<Profile> updateProfile(
        @PathVariable String userId,
        @RequestBody Profile profileUpdate
    ) {
        UUID id = UUID.fromString(userId);
        Profile updated = profileService.updateProfile(id, profileUpdate);
        return ResponseEntity.ok(updated);
    }
}
```

**Purpose:** REST API endpoint - receives HTTP requests, returns responses

---

### Frontend Components

#### 1. **API Layer** (`api.ts`)
```typescript
export const updateProfile = async (
  userId: string, 
  data: UpdateProfileRequest
): Promise<WelcomeUserInfo> => {
  const response = await api.put(`/api/profile/${userId}`, data);
  return response.data;
}
```

**Purpose:** Centralizes all API calls, handles errors, provides type safety

#### 2. **Auth Context** (`AuthContext.tsx`)
```typescript
const fetchUserProfileByEmail = async (email: string) => {
  const { data } = await supabase
    .rpc('get_profile_by_email', { p_email: email })
    .maybeSingle();
  
  setUser(data as UserProfile);
}
```

**Purpose:** Global state management for authentication and user data

#### 3. **Personal Info Screen** (`personal-info.tsx`)
```typescript
const handleSave = async () => {
  // 1. Send to Java backend (camelCase)
  await updateProfile(user.id, {
    idNumber: formData.idNumber,
    phone: formData.phone
  });
  
  // 2. Refresh from Supabase (snake_case)
  await refreshUser();
  
  // 3. Navigate back
  router.back();
}
```

**Purpose:** UI for editing profile, handles form state and submission

---

## 🔄 Data Format Conversion

### Java Backend (camelCase)
```json
{
  "idNumber": "7008020291080",
  "firstName": "John",
  "dateOfBirth": "1990-01-01"
}
```

### Database (snake_case)
```sql
id_number = '7008020291080'
first_name = 'John'
date_of_birth = '1990-01-01'
```

### JPA/Hibernate Mapping
```java
@Column(name = "id_number")
private String idNumber;
```

**Jackson (JSON library)** automatically converts:
- `idNumber` → `id_number` when saving
- `id_number` → `idNumber` when reading

---

## 🛡️ Security Considerations

### Row Level Security (RLS)
```sql
-- Problem: Direct queries blocked by RLS
SELECT * FROM profiles WHERE email = 'user@email.com';
-- Returns: 0 rows (blocked)

-- Solution: RPC function with SECURITY DEFINER
CREATE FUNCTION get_profile_by_email(p_email text)
SECURITY DEFINER  -- Runs with elevated permissions
AS $$
  SELECT * FROM profiles WHERE email = p_email;
$$;

-- Now works!
SELECT * FROM get_profile_by_email('user@email.com');
-- Returns: Full profile
```

---

## 📝 Complete Request/Response Example

### Request: Update Profile
```http
PUT http://localhost:8080/api/profile/adad8bc4-d759-4be4-97fb-852adacccd52
Content-Type: application/json

{
  "idNumber": "7008020291080",
  "phone": "0614849344",
  "firstName": "Tlhonolofatso",
  "lastName": "Ramokhoase",
  "fullName": "Tlhonolofatso Ramokhoase",
  "email": "hloniramokhoase@gmail.com",
  "gender": "Male",
  "dateOfBirth": "1970-08-02"
}
```

### Response: Updated Profile
```json
{
  "id": "adad8bc4-d759-4be4-97fb-852adacccd52",
  "email": "hloniramokhoase@gmail.com",
  "phone": "0614849344",
  "idNumber": "7008020291080",
  "firstName": "Tlhonolofatso",
  "lastName": "Ramokhoase",
  "fullName": "Tlhonolofatso Ramokhoase",
  "gender": "Male",
  "dateOfBirth": "1970-08-02",
  "createdAt": "2025-10-07T22:05:06.121753",
  "updatedAt": "2025-10-08T15:38:24.0010415"
}
```

---

## 🎯 Key Benefits of This Architecture

1. **Separation of Concerns**
   - Java Backend: Complex business logic, validation
   - Supabase: Data storage, real-time features
   - Frontend: UI and user interaction

2. **Type Safety**
   - Java: Compile-time type checking
   - TypeScript: IDE autocomplete and error detection

3. **Flexibility**
   - Can add business rules in Java
   - Can use Supabase features (realtime, auth)
   - Easy to test each layer independently

4. **Security**
   - RLS protects data at database level
   - RPC functions provide controlled access
   - PIN-based auth stored securely (hashed)

5. **Maintainability**
   - Clear data flow
   - Single database (no sync issues)
   - Logging at each layer for debugging

---

## 🐛 Common Debugging Flow

When data doesn't appear:

1. **Frontend logs**: Check if data is sent correctly
2. **Network tab**: Verify HTTP request/response
3. **Backend logs**: Confirm data received and saved
4. **Database query**: Check if data exists
5. **RPC function**: Test if it returns data
6. **Frontend refresh**: Verify data is fetched back

---

## 📚 Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React Native (Expo) | Mobile UI |
| Frontend State | React Context API | Global state |
| HTTP Client | Axios | API calls to Java backend |
| Database Client | Supabase JS | Direct DB queries (RPC) |
| Backend | Java Spring Boot | REST API & business logic |
| ORM | JPA/Hibernate | Database mapping |
| Database | PostgreSQL (Supabase) | Data storage |
| Security | RLS + SECURITY DEFINER | Access control |

---

This architecture gives you the best of both worlds: the power and type safety of Java for business logic, and the convenience of Supabase for data access and real-time features!
