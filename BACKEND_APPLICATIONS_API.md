# Backend API Documentation - eGovSA Applications & Services

## Overview
This document describes the complete backend API for managing government service applications.

## Database Schema

### 1. **applications** table
- `id` (UUID, Primary Key)
- `user_id` (String, Foreign Key to profiles)
- `service_type` (String) - Name of the government service
- `reference_number` (String, Unique) - Auto-generated reference (e.g., "ID001", "PA045")
- `status` (String) - "In Progress" | "Under Review" | "Pending Payment" | "Completed" | "Rejected"
- `current_step` (String) - Current processing step
- `application_data` (TEXT/JSON) - Form data as JSON string
- `submitted_at` (DateTime)
- `expected_completion_date` (DateTime)
- `completed_at` (DateTime, nullable)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### 2. **application_documents** table
- `id` (UUID, Primary Key)
- `application_id` (UUID, Foreign Key to applications)
- `document_type` (String) - e.g., "birth_certificate", "parent_id", "photo"
- `file_name` (String)
- `file_url` (String) - S3/storage URL
- `file_size` (Long) - Size in bytes
- `uploaded_at` (DateTime)

### 3. **services** table (Recommended)
- `id` (UUID, Primary Key)
- `service_name` (String, Unique)
- `description` (TEXT)
- `category` (String) - "Identity", "Licensing", "Tax", etc.
- `required_documents` (TEXT/JSON) - Array of required document types
- `processing_time_days` (Integer)
- `fees` (Double)
- `is_active` (Boolean)
- `created_at` (DateTime)
- `updated_at` (DateTime)

## API Endpoints

### Applications

#### Create Application
```
POST /api/applications?userId={userId}
Content-Type: application/json

{
  "serviceType": "Smart ID Application",
  "applicationData": "{\"name\":\"John Doe\",\"idNumber\":\"1234567890123\"}"
}

Response: 201 Created
{
  "id": "uuid",
  "userId": "uuid",
  "serviceType": "Smart ID Application",
  "referenceNumber": "ID001",
  "status": "In Progress",
  "currentStep": "Document Verification",
  "applicationData": "...",
  "submittedAt": "2024-10-10T10:00:00Z",
  "expectedCompletionDate": "2024-10-24T10:00:00Z",
  "createdAt": "2024-10-10T10:00:00Z",
  "updatedAt": "2024-10-10T10:00:00Z",
  "documents": []
}
```

#### Get User Applications
```
GET /api/applications/user/{userId}

Response: 200 OK
[
  {
    "id": "uuid",
    "userId": "uuid",
    "serviceType": "Smart ID Application",
    "referenceNumber": "ID001",
    "status": "In Progress",
    ...
  }
]
```

#### Get Applications by Status
```
GET /api/applications/user/{userId}/status/{status}
Example: GET /api/applications/user/123/status/Completed
```

#### Get Applications by Multiple Statuses
```
POST /api/applications/user/{userId}/statuses
Content-Type: application/json

["In Progress", "Under Review", "Pending Payment"]
```

#### Get Single Application
```
GET /api/applications/{id}
```

#### Get Application by Reference Number
```
GET /api/applications/reference/{referenceNumber}
Example: GET /api/applications/reference/ID001
```

#### Update Application Status
```
PATCH /api/applications/{id}/status
Content-Type: application/json

{
  "status": "Under Review",
  "currentStep": "Biometric Verification"
}
```

#### Add Document to Application
```
POST /api/applications/{applicationId}/documents
Content-Type: application/json

{
  "documentType": "birth_certificate",
  "fileName": "birth_cert.pdf",
  "fileUrl": "https://storage.example.com/...",
  "fileSize": 102400
}
```

#### Get Application Documents
```
GET /api/applications/{applicationId}/documents
```

#### Delete Application
```
DELETE /api/applications/{id}
```

### Services

#### Get All Active Services
```
GET /api/services

Response: 200 OK
[
  {
    "id": "uuid",
    "serviceName": "Smart ID Application",
    "description": "...",
    "category": "Identity",
    "requiredDocuments": "[\"birth_certificate\",\"parent_id\",\"photo\"]",
    "processingTimeDays": 14,
    "fees": 0.0,
    "isActive": true,
    ...
  }
]
```

#### Get Services by Category
```
GET /api/services/category/{category}
Example: GET /api/services/category/Identity
```

#### Get Service by Name
```
GET /api/services/name/{serviceName}
```

#### Create Service (Admin)
```
POST /api/services
Content-Type: application/json

{
  "serviceName": "Smart ID Application",
  "description": "Apply for a new Smart ID card",
  "category": "Identity",
  "requiredDocuments": "[\"birth_certificate\",\"parent_id\",\"photo\"]",
  "processingTimeDays": 14,
  "fees": 0.0,
  "isActive": true
}
```

## Frontend Integration

### Update Service Forms
Each service form (Smart ID, Passport, Learner's Licence) should call `createApplication` on submit:

```typescript
import { createApplication } from '../../src/lib/api'

const handleSubmit = async () => {
  try {
    const applicationData = JSON.stringify({
      fullName,
      idNumber,
      dateOfBirth: dob,
      gender,
      // ... other form fields
    })

    const application = await createApplication(user.id, {
      serviceType: 'Smart ID Application',
      applicationData
    })

    Alert.alert(
      'Application Submitted',
      `Your reference number is: ${application.referenceNumber}\n` +
      `Expected completion: ${formatDate(application.expectedCompletionDate)}`
    )
  } catch (error) {
    Alert.alert('Error', 'Failed to submit application')
  }
}
```

### Applications Screen
The applications screen now:
- Fetches real data from the backend
- Groups applications by status (Active, Completed, Rejected)
- Supports pull-to-refresh
- Formats dates properly
- Shows loading states

## Reference Number Generation

The system automatically generates reference numbers based on service type:
- Smart ID → `ID###` (e.g., ID001)
- Passport → `PA###`
- Learner's Licence → `LL###`
- Driving License → `DL###`
- Birth Certificate → `BC###`
- Tax Return → `TAX###`
- Business License → `BUS###`
- Vehicle Registration → `VR###`
- Default → `APP###`

## Processing Time Calculation

Default processing times by service:
- Smart ID: 14 days
- Passport: 21 days
- Learner's Licence: 7 days
- Driving License: 10 days
- Birth Certificate: 14 days
- Tax Return: 21 days

The system automatically calculates expected completion dates, ensuring they fall on weekdays.

## File Structure

```
eGovSa-Backend/
├── src/main/java/org/itmda/egovsabackend/
│   ├── entity/
│   │   ├── Application.java
│   │   ├── ApplicationDocument.java
│   │   └── Service.java
│   ├── repository/
│   │   ├── ApplicationRepository.java
│   │   ├── ApplicationDocumentRepository.java
│   │   └── ServiceRepository.java
│   ├── service/
│   │   ├── ApplicationService.java
│   │   └── ServiceService.java
│   ├── controller/
│   │   ├── ApplicationController.java
│   │   └── ServiceController.java
│   └── dto/
│       ├── ApplicationDto.java
│       ├── ApplicationDocumentDto.java
│       ├── CreateApplicationRequest.java
│       └── ServiceDto.java
```

## Next Steps

1. **Database Setup**: Create the tables in your Supabase/PostgreSQL database
2. **Test Backend**: Start the Spring Boot application and test endpoints with Postman
3. **File Upload**: Implement file upload service (S3, Azure Blob, or Supabase Storage)
4. **Integrate Forms**: Update all service forms to call the API on submit
5. **Add Notifications**: Implement notifications for status changes
6. **Admin Portal**: Create admin screens to manage applications and services

## Example: Testing with Postman

1. **Create Application**:
   - POST `http://localhost:8080/api/applications?userId=YOUR_USER_ID`
   - Body: `{"serviceType": "Smart ID Application", "applicationData": "{}"}`

2. **Get Applications**:
   - GET `http://localhost:8080/api/applications/user/YOUR_USER_ID`

3. **Update Status**:
   - PATCH `http://localhost:8080/api/applications/APP_ID/status`
   - Body: `{"status": "Completed", "currentStep": "Issued"}`
