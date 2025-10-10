# Backend API Integration Guide

## Welcome API Integration

The home screen now fetches welcome data from your Spring Boot backend API.

### Backend Endpoint

```
GET /api/home/welcome/{userId}
```

**Response:**
```json
{
  "message": "Hi John, welcome back to eGov SA",
  "user": {
    "id": "uuid-string",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+27123456789",
    "fullName": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then update the `EXPO_PUBLIC_API_URL` with your backend URL:

**For Android Emulator:**
```
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

**For iOS Simulator:**
```
EXPO_PUBLIC_API_URL=http://localhost:8080
```

**For Physical Device (same network):**
```
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8080
```

**For Production:**
```
EXPO_PUBLIC_API_URL=https://your-backend-api.com
```

### 2. Start Your Backend

Make sure your Spring Boot backend is running on port 8080:

```bash
cd your-backend-project
./mvnw spring-boot:run
```

### 3. Test the API

You can test the endpoint using curl:

```bash
curl http://localhost:8080/api/home/welcome/YOUR_USER_UUID
```

### 4. Restart Expo

After changing environment variables, restart your Expo app:

```bash
npm start -- --clear
```

## Features Implemented

### 1. API Service (`src/lib/api.ts`)
- Centralized API client using axios
- Type-safe interfaces for API responses
- `fetchWelcomeData()` function to get welcome information

### 2. Home Screen Updates (`app/(tabs)/home.tsx`)
- Fetches welcome data on component mount
- Shows loading indicator while fetching
- Fallback to local data if API fails
- Displays personalized welcome message from backend

## How It Works

1. When the home screen loads, it calls `fetchWelcomeData(userId)`
2. The API service makes a GET request to `/api/home/welcome/{userId}`
3. Backend returns personalized welcome message and user info
4. Home screen displays the message with loading states
5. If API fails, falls back to local user data from Supabase

## Error Handling

The implementation includes robust error handling:
- Network errors are caught and logged
- Loading states are properly managed
- Fallback to local user data if backend is unavailable
- User experience is not disrupted by API failures

## Future Enhancements

You can extend the API integration by:
1. Adding authentication tokens to API requests
2. Implementing refresh tokens
3. Adding more endpoints for notifications, services, etc.
4. Caching API responses for offline support

## Troubleshooting

### Cannot connect to backend

**Android Emulator:**
- Use `http://10.0.2.2:8080` instead of `localhost`
- Make sure backend is running on your local machine

**iOS Simulator:**
- Use `http://localhost:8080`
- Make sure backend is running

**Physical Device:**
- Device must be on same network as your computer
- Use your computer's IP address: `http://192.168.x.x:8080`
- Check firewall settings

### CORS Issues

Make sure your backend has CORS enabled:
```java
@CrossOrigin(origins = "*")
```

Or configure it globally in your Spring Boot configuration.

## Next Steps

1. Copy `.env.example` to `.env` and configure your API URL
2. Start your Spring Boot backend
3. Restart your Expo app
4. Test the welcome message on the home screen
