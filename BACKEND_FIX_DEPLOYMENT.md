# Backend Fix - 500 Error Resolution

## Issue
The admin portal was getting 500 errors when calling:
- `GET /api/admin/applications`
- `GET /api/admin/statistics`

## Root Cause
The `AdminService.java` had inefficient filtering logic that was trying to use `findByUserIdAndStatus()` with a random UUID, which doesn't make sense for admin queries.

## Fix Applied
**File**: `eGovSa-Backend/src/main/java/org/itmda/egovsabackend/service/AdminService.java`

### Changed:
1. **getAllApplications()** - Simplified to just fetch all applications with pagination
2. **getStatistics()** - Removed the incorrect `findByUserIdAndStatus()` calls and only uses `findAll()`

## How to Deploy

### Option 1: Maven Build and Deploy to Azure

```bash
cd eGovSa-Backend

# Clean and build
mvn clean package -DskipTests

# The JAR will be in target/eGovSa-Backend-0.0.1-SNAPSHOT.jar

# Deploy to Azure App Service (replace with your app name)
az webapp deploy --resource-group <your-resource-group> \
  --name egovbackend \
  --src-path target/eGovSa-Backend-0.0.1-SNAPSHOT.jar \
  --type jar
```

### Option 2: Using Azure Portal

1. Open Azure Portal
2. Go to your App Service: `egovbackend`
3. Go to "Deployment Center"
4. Upload the JAR file from `target/eGovSa-Backend-0.0.1-SNAPSHOT.jar`

### Option 3: Using VS Code Azure Extension

1. Open VS Code
2. Install "Azure App Service" extension
3. Right-click on `eGovSa-Backend` folder
4. Select "Deploy to Web App"
5. Select your Azure subscription and app service

### Option 4: Local Testing First

Before deploying, test locally:

```bash
cd eGovSa-Backend

# Run locally
mvn spring-boot:run

# Test in browser
# http://localhost:8080/api/admin/statistics
# http://localhost:8080/api/admin/applications?page=0&size=20
```

Then update admin portal `.env`:
```env
VITE_API_URL=http://localhost:8080
```

## Verification

After deployment, test these endpoints:

**Statistics:**
```
https://egovbackend.azurewebsites.net/api/admin/statistics
```

Expected response:
```json
{
  "totalApplications": 5,
  "pendingReview": 2,
  "approved": 2,
  "rejected": 1,
  "inProgress": 3,
  "pendingPayment": 0
}
```

**Applications:**
```
https://egovbackend.azurewebsites.net/api/admin/applications?page=0&size=20
```

Expected response:
```json
{
  "content": [...],
  "totalElements": 5,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

## Admin Portal

Once backend is redeployed, the admin portal should work:

```bash
cd gov-approver-dash
npm run dev
```

Navigate to:
- Dashboard - Should show real statistics
- Applications - Should show real applications

## If Still Getting Errors

Check Azure logs:
```bash
az webapp log tail --name egovbackend --resource-group <your-resource-group>
```

Or in Azure Portal:
1. Go to App Service
2. Click "Log stream"
3. Watch for errors
