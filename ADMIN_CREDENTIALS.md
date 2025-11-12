# 🔐 Admin User Credentials - All Roles

## **5 Admin Accounts for Testing**

---

## 📋 **Quick Reference**

| Role | Email | Password | Dashboard URL |
|------|-------|----------|---------------|
| **Super Admin** | `superadmin@travunited.com` | `SuperAdmin@123` | `/super-admin` |
| **Admin** | `admin@travunited.com` | `Admin@123` | `/admin` |
| **Sub Admin** | `subadmin@travunited.com` | `SubAdmin@123` | `/admin` |
| **Regional Admin** | `regionaladmin@travunited.com` | `RegionalAdmin@123` | `/regional-admin` |
| **Maintenance Admin** | `maintenance@travunited.com` | `Maintenance@123` | `/maintenance` |

---

## 🎯 **Setup Instructions**

### **Method 1: Via Supabase Dashboard (Easiest)** ⭐

**Step 1: Create Users in Supabase**

1. Go to: https://supabase.com/dashboard/project/esbzzprfgkhccigvyuiw/auth/users
2. Click **"Add User"** button
3. For each role, create a user with:

**User 1 - Super Admin:**
```
Email: travunited3@gmail.com
Password: Marigudi@9
☑️ Auto Confirm User: YES
```

**User 2 - Admin:**
```
Email: admin@travunited.com
Password: Admin@123
☑️ Auto Confirm User: YES
```

**User 3 - Sub Admin:**
```
Email: subadmin@travunited.com
Password: SubAdmin@123
☑️ Auto Confirm User: YES
```

**User 4 - Regional Admin:**
```
Email: regionaladmin@travunited.com
Password: RegionalAdmin@123
☑️ Auto Confirm User: YES
```

**User 5 - Maintenance Admin:**
```
Email: maintenance@travunited.com
Password: Maintenance@123
☑️ Auto Confirm User: YES
```

**Step 2: Run SQL Script**

1. Go to: https://supabase.com/dashboard/project/esbzzprfgkhccigvyuiw/sql
2. Open file: `database/create-admin-users-all-roles.sql`
3. Copy all contents
4. Paste in SQL Editor
5. Click **"Run"**

**Step 3: Verify**

Run this query in SQL Editor:
```sql
SELECT email, full_name, role, is_active
FROM user_profiles
WHERE email LIKE '%@travunited.com'
ORDER BY role;
```

You should see all 5 users with their roles assigned!

---

### **Method 2: Via Supabase API (Advanced)**

If you prefer automation, use the script below:

```bash
# Save this as create-admin-users.sh

#!/bin/bash

# Supabase credentials
PROJECT_URL="https://esbzzprfgkhccigvyuiw.supabase.co"
SERVICE_ROLE_KEY="your_service_role_key_here"

# User 1: Super Admin
curl -X POST "$PROJECT_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "travunited3@gmail.com",
    "password": "Marigudi@9",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Super Admin User",
      "role": "super_admin"
    }
  }'

# User 2: Admin
curl -X POST "$PROJECT_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@travunited.com",
    "password": "Admin@123",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Admin User",
      "role": "admin"
    }
  }'

# User 3: Sub Admin
curl -X POST "$PROJECT_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subadmin@travunited.com",
    "password": "SubAdmin@123",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Sub Admin User",
      "role": "sub_admin"
    }
  }'

# User 4: Regional Admin
curl -X POST "$PROJECT_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "regionaladmin@travunited.com",
    "password": "RegionalAdmin@123",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Regional Admin User",
      "role": "regional_admin"
    }
  }'

# User 5: Maintenance Admin
curl -X POST "$PROJECT_URL/auth/v1/admin/users" \
  -H "apikey: $SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maintenance@travunited.com",
    "password": "Maintenance@123",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Maintenance Admin User",
      "role": "maintenance_admin"
    }
  }'
```

---

## 🎭 **Role Permissions & Access**

### **1. Super Admin** 🔴
**Email:** `superadmin@travunited.com`  
**Password:** `SuperAdmin@123`  
**Dashboard:** `/super-admin`

**Can Access:**
- ✅ Full system control
- ✅ User management (create, edit, delete users)
- ✅ Role assignment
- ✅ Application management (all regions)
- ✅ Payment management (refunds, disputes)
- ✅ Country/Visa configuration
- ✅ System configuration
- ✅ Analytics dashboard
- ✅ Email template configuration
- ✅ Backup & restore
- ✅ Everything!

**Test These Features:**
- Create/edit/delete users
- Assign roles to users
- View all applications
- Configure system settings
- View analytics with charts

---

### **2. Admin** 🟠
**Email:** `admin@travunited.com`  
**Password:** `Admin@123`  
**Dashboard:** `/admin`

**Can Access:**
- ✅ Application review & approval
- ✅ Document verification
- ✅ User support (assigned tickets)
- ✅ Status management
- ✅ Add admin notes
- ✅ View assigned applications
- ✅ Blog post management
- ✅ Support ticket handling

**Cannot Access:**
- ❌ User management
- ❌ Role assignment
- ❌ System configuration
- ❌ Payment refunds
- ❌ Global analytics

**Test These Features:**
- Review applications
- Verify documents
- Approve/reject applications
- Add notes to applications
- Handle support tickets
- Create blog posts

---

### **3. Sub Admin** 🟡
**Email:** `subadmin@travunited.com`  
**Password:** `SubAdmin@123`  
**Dashboard:** `/admin`

**Can Access:**
- ✅ View assigned applications
- ✅ Document verification
- ✅ Update application status
- ✅ User support (assigned)
- ✅ Add notes (limited)

**Cannot Access:**
- ❌ Final approval (can only recommend)
- ❌ User management
- ❌ Payment operations
- ❌ System configuration
- ❌ Blog management

**Test These Features:**
- View assigned applications
- Verify documents
- Recommend approval
- Add notes
- View support tickets

---

### **4. Regional Admin** 🟢
**Email:** `regionaladmin@travunited.com`  
**Password:** `RegionalAdmin@123`  
**Dashboard:** `/regional-admin`

**Can Access:**
- ✅ Regional operations (assigned region)
- ✅ Applications for assigned region
- ✅ Regional analytics
- ✅ Regional user management
- ✅ Regional reports
- ✅ Performance metrics

**Cannot Access:**
- ❌ Global operations
- ❌ Other regions
- ❌ System configuration
- ❌ Role assignment

**Test These Features:**
- View regional applications
- Regional analytics
- Performance metrics
- Regional reports

---

### **5. Maintenance Admin** 🔵
**Email:** `maintenance@travunited.com`  
**Password:** `Maintenance@123`  
**Dashboard:** `/maintenance`

**Can Access:**
- ✅ System health monitoring
- ✅ Database health
- ✅ Backup & restore
- ✅ Log analysis
- ✅ Performance monitoring
- ✅ Error tracking
- ✅ Cache management
- ✅ Background job status

**Cannot Access:**
- ❌ User data
- ❌ Applications
- ❌ Payments
- ❌ Content management

**Test These Features:**
- View system health
- Monitor performance
- Check error logs
- View background jobs

---

## 🧪 **Testing Scenarios**

### **Scenario 1: Complete Application Flow**

1. **User applies for visa:**
   - Regular user creates visa application
   - Uploads documents
   - Makes payment

2. **Sub Admin verifies documents:**
   - Login: `subadmin@travunited.com`
   - Go to `/admin/documents`
   - Verify documents
   - Recommend approval

3. **Admin approves application:**
   - Login: `admin@travunited.com`
   - Go to `/admin/applications`
   - Review application
   - Approve

4. **Super Admin reviews:**
   - Login: `superadmin@travunited.com`
   - View analytics
   - Check audit logs

---

### **Scenario 2: Role-Based Access Test**

**Test 1: Try accessing other dashboards**
- Login as Admin
- Try to access `/super-admin` → Should redirect to `/admin`

**Test 2: Try unauthorized actions**
- Login as Sub Admin
- Try to delete a user → Should fail (no permission)

**Test 3: Regional access**
- Login as Regional Admin
- Can only see applications from assigned region

---

## 🔒 **Security Notes**

### **Production Recommendations:**

1. **Change all passwords immediately after testing**
2. **Use strong passwords:**
   - Minimum 12 characters
   - Mix of upper, lower, numbers, symbols
   - Unique per account

3. **Enable MFA for all admin accounts:**
   - Go to `/settings/security`
   - Enable two-factor authentication
   - Save backup codes

4. **Restrict IP access (optional):**
   - Configure Supabase to allow admin access only from specific IPs

5. **Regular audits:**
   - Review security events at `/super-admin/security/logs`
   - Check unusual login patterns

---

## 📊 **Verification Checklist**

After creating all users, verify:

```
✅ All 5 users created in Supabase Auth
✅ All 5 profiles created with correct roles
✅ Can login with each account
✅ Each role redirects to correct dashboard
✅ Permissions work as expected
✅ Cannot access unauthorized pages
✅ Audit logs capture actions
```

---

## 🚀 **Quick Login Links (After Setup)**

For local development (`http://localhost:3000`):

1. **Super Admin:** http://localhost:3000/login → `/super-admin`
2. **Admin:** http://localhost:3000/login → `/admin`
3. **Sub Admin:** http://localhost:3000/login → `/admin`
4. **Regional Admin:** http://localhost:3000/login → `/regional-admin`
5. **Maintenance Admin:** http://localhost:3000/login → `/maintenance`

---

## 🎯 **Summary**

**5 Admin Accounts Created:**
```
1. Super Admin:      superadmin@travunited.com     / SuperAdmin@123
2. Admin:            admin@travunited.com          / Admin@123
3. Sub Admin:        subadmin@travunited.com       / SubAdmin@123
4. Regional Admin:   regionaladmin@travunited.com  / RegionalAdmin@123
5. Maintenance:      maintenance@travunited.com    / Maintenance@123
```

**All roles have different permissions and access levels!**

**Test each role to experience the complete RBAC system!** 🎊

---

**Status:** ✅ **All Admin Accounts Ready**  
**Next:** Test login and role-based access  
**Security:** Remember to change passwords in production!


