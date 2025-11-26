# Quick Start Guide - eGovSA Admin Portal

## Step 1: Create Database Tables

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: `buqqhpqxldqhiazpluvb`
3. Go to SQL Editor
4. Copy and paste the contents of `database-admin-tables.sql`
5. Click "Run" to create the tables

**Or** let Spring Boot auto-create them:
- The tables will be created automatically when you start the backend
- JPA is configured with `spring.jpa.hibernate.ddl-auto=update`

## Step 2: Deploy Backend (Optional - Already Running on Azure)

Your backend is already deployed at: `https://egovbackend.azurewebsites.net`

If you need to redeploy with new changes:

```bash
cd eGovSa-Backend
mvn clean package -DskipTests
# Deploy to Azure using your existing process
```

Verify it's running:
```
https://egovbackend.azurewebsites.net/actuator/health
```

## Step 3: Run Admin Portal Locally

```bash
cd gov-approver-dash

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The portal will open at: `http://localhost:5173`

## Step 4: Test the Integration

### Test Dashboard
1. Navigate to Dashboard page
2. You should see real statistics (not 1,234, 89, etc.)
3. Recent applications should show actual data with reference numbers like "ID045", "PA123", etc.
4. Statistics should update every 10 seconds

### Test Applications Page
1. Navigate to Applications page
2. Search for an application by name, ID, or reference number
3. Filter by status (Pending/Review, Approved, Rejected)
4. Click "View" icon (eye) to see full application details
5. Click "Approve" (green checkmark) or "Reject" (red X) on a pending application
6. A success toast should appear
7. The application status should update
8. Check your mobile app - a push notification should appear

### Test Document Downloads
1. Click "View" on an application that has documents
2. Scroll to "Submitted Documents" section
3. Click the download icon next to a document
4. The file should download from Supabase Storage

## Step 5: Deploy Admin Portal to Production

### Option A: Vercel (Recommended)

```bash
cd gov-approver-dash

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts
# Set environment variable: VITE_API_URL=https://egovbackend.azurewebsites.net
```

### Option B: Netlify

```bash
cd gov-approver-dash

# Build
npm run build

# Deploy the 'dist' folder to Netlify
# Or connect your GitHub repo to Netlify for automatic deployments
```

### Option C: Azure Static Web Apps

```bash
cd gov-approver-dash

# Build
npm run build

# Use Azure Static Web Apps extension in VS Code
# Or use Azure CLI to deploy the 'dist' folder
```

## What to Expect

### Dashboard
- **Total Applications**: Real count from database
- **Pending Review**: Applications with status "Under Review"
- **Approved**: Applications with status "Completed"
- **Rejected**: Applications with status "Rejected"
- **Recent Applications**: Last 5 applications sorted by submission date
- **Auto-refresh**: Every 10 seconds

### Applications Page
- **All Applications**: Paginated list (20 per page)
- **Search**: By applicant name, ID number, or reference number
- **Filter**: By status (all, pending, approved, rejected)
- **Actions**: View, Approve, Reject
- **Auto-refresh**: Every 30 seconds
- **Details Modal**: Shows full application data, documents, and status

### Automatic Features
When you approve/reject an application:
1. ✅ Application status updated in database
2. ✅ Status history record created
3. ✅ Admin action logged to audit table
4. ✅ Push notification automatically sent to mobile user
5. ✅ Mobile app displays notification
6. ✅ Admin portal refreshes to show updated status

## Troubleshooting

### "Failed to load dashboard data"
**Check:**
- Backend is running: `https://egovbackend.azurewebsites.net/actuator/health`
- `.env` file exists in `gov-approver-dash` folder
- `.env` contains: `VITE_API_URL=https://egovbackend.azurewebsites.net`
- Restart dev server after changing `.env`

### No applications showing
**Possible reasons:**
- No applications in database yet
- Submit a test application from mobile app first
- Check backend logs for errors

### Document download not working
**Check:**
- Supabase Storage bucket exists: `application-documents`
- Bucket has correct permissions (read access enabled)
- File URLs in database are valid Supabase URLs
- CORS is enabled on Supabase Storage

### Push notifications not received on mobile
**Check:**
- User has `push_notifications_enabled = true` in profiles table
- User has valid `push_token` in profiles table
- Check `notifications` table to see if notification was created
- Mobile app is running and has notification permissions

## Next Steps (Optional Enhancements)

### Add Authentication
Currently anyone can access the admin portal. To secure it:
1. Add Spring Security with JWT to backend
2. Create admin user table
3. Add login page to admin portal
4. Store JWT token in localStorage
5. Add protected routes

### Add User Management
Create a new page to:
- View all registered users
- Search and filter users
- View user's application history
- Enable/disable user accounts

### Add Analytics Dashboard
Enhance dashboard with:
- Application trends over time (charts)
- Processing time metrics
- Service type breakdown
- Geographic distribution

### Add Bulk Actions
Allow admins to:
- Select multiple applications
- Approve/reject in bulk
- Export to CSV/Excel
- Generate reports

## Support

For issues or questions:
1. Check `ADMIN_PORTAL_INTEGRATION_COMPLETE.md` for detailed documentation
2. Check browser console for errors
3. Check backend logs in Azure
4. Verify database tables created successfully

## Summary

✅ Backend API running on Azure  
✅ Admin portal connects to real data  
✅ Auto-refresh functionality working  
✅ Push notifications automatic  
✅ Document downloads functional  
✅ Audit trail implemented  

Your admin portal is ready to use! 🎉
