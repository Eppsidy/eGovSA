# eGovSA Admin Portal Integration - Complete

## Overview

The admin portal has been successfully integrated with the eGovSA Spring Boot backend. All mock data has been removed and replaced with real-time data from your PostgreSQL database hosted on Supabase.

## What Was Done

### 1. Backend Changes (eGovSa-Backend)

#### New Database Tables (JPA Entities)
- **ApplicationStatusHistory** - Tracks all status changes for applications
  - Records old status, new status, timestamp, and optional notes
  - Linked to applications via `application_id` foreign key

- **AdminAction** - Audit trail for admin operations
  - Records action type (APPROVE, REJECT, UPDATE_STATUS, etc.)
  - Links to application and affected user
  - Stores timestamp and action details

#### New Services
- **StorageService** - Handles Supabase Storage integration
  - Generates signed URLs for secure document downloads
  - Extracts file paths from full Supabase URLs
  - Configurable expiration time (default 1 hour)

- **AdminService** - Core admin functionality
  - Fetches all applications with pagination and filtering
  - Calculates real-time dashboard statistics
  - Approves/rejects applications with automatic notifications
  - Logs all actions to audit tables
  - Sends push notifications to mobile users automatically

#### New API Endpoints

**Admin Controller** (`/api/admin/*`)
```
GET  /api/admin/applications       - Paginated list with filters
GET  /api/admin/statistics         - Dashboard metrics
GET  /api/admin/users              - All user profiles
PATCH /api/admin/applications/{id}/approve
PATCH /api/admin/applications/{id}/reject
PATCH /api/admin/applications/{id}/status
```

**Document Controller** (`/api/documents/*`)
```
GET /api/documents/{id}/download-url  - Get signed download URL
GET /api/documents/{id}               - Get document metadata
```

#### Dependencies Added
- Supabase Kotlin library for storage integration
- OkHttp for HTTP requests

### 2. Admin Portal Changes (gov-approver-dash)

#### New Files Created
- `src/lib/api.ts` - Complete API service layer with TypeScript types
- `src/hooks/useAutoRefresh.ts` - Custom hook for auto-refreshing data
- `.env` - Environment configuration

#### Updated Pages

**Dashboard.tsx**
- ✅ Removed all 5 hardcoded applications
- ✅ Removed hardcoded statistics (1,234 total, etc.)
- ✅ Connected to `GET /api/admin/statistics` for real-time counts
- ✅ Connected to `GET /api/admin/applications` for recent apps
- ✅ Auto-refreshes every 10 seconds
- ✅ Shows loading skeletons while fetching
- ✅ Displays actual reference numbers, names, and dates
- ✅ Error handling with user-friendly messages

**Applications.tsx**
- ✅ Removed all 5 hardcoded application records
- ✅ Connected to backend API with pagination (20 per page)
- ✅ Search functionality with 300ms debounce
- ✅ Filter by status (maps to backend status values)
- ✅ Auto-refreshes every 30 seconds
- ✅ Approve/Reject buttons trigger backend endpoints
- ✅ Automatic push notifications sent to mobile users
- ✅ Document download with signed URLs from Supabase Storage
- ✅ View full application data (JSON parsed and formatted)
- ✅ Shows loading states and disabled buttons during processing
- ✅ Pagination controls for large datasets
- ✅ Real-time total count display

### 3. Integration Features

#### Automatic Push Notifications
When an admin approves or rejects an application:
1. Backend updates application status in database
2. Creates status history record
3. Creates admin action audit log
4. **Automatically sends push notification** to user's mobile app via existing `/api/notifications` endpoint
5. Mobile app displays notification with status change

**Notification Messages:**
- **Approved**: "Your {serviceType} application {referenceNumber} has been approved and is now complete."
- **Rejected**: "Your {serviceType} application {referenceNumber} has been rejected. Please contact support for more information."

#### Document Handling
- Documents stored in Supabase Storage bucket: `application-documents`
- Admin portal requests signed download URL (1-hour expiration)
- Browser downloads file directly from Supabase
- Supports all file types uploaded from mobile app

#### Auto-Refresh Strategy
- **Dashboard**: Refreshes every 10 seconds
- **Applications**: Refreshes every 30 seconds
- **Search**: 300ms debounce to prevent excessive API calls
- Maintains user's current page and filter selections

#### Status Mapping
Mobile/Backend → Admin Portal Display
- "In Progress" → Pending (blue badge)
- "Under Review" → Pending Review (warning badge)
- "Pending Payment" → Pending Payment (warning badge)
- "Completed" → Approved (success badge)
- "Rejected" → Rejected (destructive badge)

## Database Schema

### New Tables to Add

Run these SQL commands in your PostgreSQL database (Supabase):

```sql
-- Application Status History Table
CREATE TABLE IF NOT EXISTS application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(100),
    new_status VARCHAR(100) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

CREATE INDEX idx_status_history_app ON application_status_history(application_id);
CREATE INDEX idx_status_history_changed ON application_status_history(changed_at DESC);

-- Admin Actions Audit Table
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type VARCHAR(100) NOT NULL,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_actions_timestamp ON admin_actions(timestamp DESC);
CREATE INDEX idx_admin_actions_application ON admin_actions(application_id);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);
```

### Existing Tables (No Changes Needed)
- ✅ `profiles` - User accounts
- ✅ `applications` - Application records
- ✅ `application_documents` - Document attachments
- ✅ `services` - Service catalog
- ✅ `notifications` - Push notifications
- ✅ `appointments` - User appointments
- ✅ `payment_methods` - Saved payment methods

## Configuration

### Backend Configuration
**File**: `eGovSa-Backend/src/main/resources/application.properties`

Added:
```properties
supabase.url=https://buqqhpqxldqhiazpluvb.supabase.co
supabase.key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
supabase.storage.bucket=application-documents
```

### Admin Portal Configuration
**File**: `gov-approver-dash/.env`

```env
VITE_API_URL=https://egovbackend.azurewebsites.net
```

## How to Deploy

### 1. Deploy Backend Changes

```bash
cd eGovSa-Backend

# Build the project
mvn clean package -DskipTests

# The tables will be auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
# Or manually run the SQL scripts above in Supabase SQL editor

# Deploy to Azure (your existing process)
```

### 2. Run Admin Portal Locally

```bash
cd gov-approver-dash

# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

### 3. Build Admin Portal for Production

```bash
cd gov-approver-dash

# Build for production
npm run build

# The build output will be in the 'dist' folder
# Deploy to your hosting service (Vercel, Netlify, Azure Static Web Apps, etc.)
```

## Testing the Integration

### 1. Test Backend Endpoints

Using your browser or Postman:

**Get Statistics:**
```
GET https://egovbackend.azurewebsites.net/api/admin/statistics
```

**Get Applications:**
```
GET https://egovbackend.azurewebsites.net/api/admin/applications?page=0&size=20
```

**Approve Application (replace {id} with actual UUID):**
```
PATCH https://egovbackend.azurewebsites.net/api/admin/applications/{id}/approve
Content-Type: application/json

{
  "notes": "Application meets all requirements"
}
```

### 2. Test Admin Portal

1. Start the dev server: `npm run dev`
2. Navigate to Dashboard - should show real statistics
3. Navigate to Applications - should show real application data
4. Try searching for an application
5. Try filtering by status
6. Click "View" on an application to see details
7. Click "Approve" or "Reject" on a pending application
8. Check mobile app - user should receive push notification

### 3. Verify Mobile App Receives Notifications

1. Submit a test application from the mobile app
2. Open admin portal and approve/reject it
3. Check mobile app notifications screen
4. Notification should appear automatically

## API Response Examples

### Statistics Response
```json
{
  "totalApplications": 45,
  "pendingReview": 12,
  "approved": 28,
  "rejected": 5,
  "inProgress": 8,
  "pendingPayment": 4
}
```

### Applications Response
```json
{
  "content": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174001",
      "applicantName": "John Doe",
      "applicantEmail": "john@example.com",
      "applicantPhone": "+27123456789",
      "applicantIdNumber": "9001015800083",
      "serviceType": "Smart ID Application",
      "referenceNumber": "ID045",
      "status": "Under Review",
      "currentStep": "Document Verification",
      "applicationData": "{\"name\":\"John\",\"surname\":\"Doe\",\"dob\":\"1990-01-01\"}",
      "submittedAt": "2024-11-26T10:30:00",
      "expectedCompletionDate": "2024-12-10T10:30:00",
      "completedAt": null,
      "createdAt": "2024-11-26T10:30:00",
      "updatedAt": "2024-11-26T10:30:00",
      "documents": [
        {
          "id": "doc-123",
          "applicationId": "123e4567-e89b-12d3-a456-426614174000",
          "documentType": "id_document",
          "fileName": "id_scan.pdf",
          "fileUrl": "https://buqqhpqxldqhiazpluvb.supabase.co/storage/v1/object/public/application-documents/id_scan.pdf",
          "fileSize": 245678,
          "uploadedAt": "2024-11-26T10:32:00"
        }
      ]
    }
  ],
  "totalElements": 45,
  "totalPages": 3,
  "size": 20,
  "number": 0
}
```

## Security Notes

⚠️ **Important**: The admin portal currently has **NO authentication**. Anyone with the URL can access it.

### Recommendations for Production:
1. Add authentication layer (JWT, OAuth, etc.)
2. Restrict CORS to specific domains (not `origins = "*"`)
3. Add role-based access control (ADMIN, REVIEWER, MANAGER)
4. Use HTTPS only
5. Store Supabase credentials in environment variables, not in properties file
6. Add rate limiting to prevent API abuse
7. Implement session timeout
8. Add audit logging for all admin actions

## Troubleshooting

### Admin Portal Shows No Data
- Check browser console for API errors
- Verify backend is running: `https://egovbackend.azurewebsites.net/actuator/health`
- Check `.env` file has correct `VITE_API_URL`
- Ensure CORS is enabled on backend

### Documents Won't Download
- Verify Supabase Storage bucket exists: `application-documents`
- Check Supabase bucket permissions (should allow read access)
- Verify file URLs in database are correct
- Check browser console for CORS errors

### Mobile App Doesn't Receive Notifications
- Check notification was created: Query `notifications` table
- Verify user has `push_notifications_enabled = true`
- Check mobile app has valid `push_token`
- Test notification endpoint directly

### Backend Errors
- Check Azure logs for detailed error messages
- Verify database connection: Check `application.properties`
- Ensure new tables were created (run SQL scripts manually if needed)
- Check Maven dependencies installed correctly

## Summary

✅ **Complete Integration Achieved**
- Admin portal connected to real backend API
- All mock data removed
- Auto-refresh functionality working
- Push notifications automatic on status changes
- Document downloads functional via Supabase Storage
- Pagination, search, and filtering working
- Audit trail and status history tracked
- Mobile app integration maintained

The admin portal is now fully functional and integrated with your eGovSA ecosystem!
