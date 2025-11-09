# 🔐 Admin Users Setup - Simplified Guide

## **Problem: Supabase CLI connection issues**

The programmatic approach has connection limitations. Here's the **EASIEST way** to set up admin users:

---

## ✅ **RECOMMENDED: Manual Setup (5 minutes)**

### **Step 1: Create Users in Supabase Dashboard**

Go to: https://supabase.com/dashboard/project/esbzzprfgkhccigvyuiw/auth/users

Click **"Add User"** 5 times to create these users:

#### **User 1: Super Admin (Already exists - travunited3@gmail.com)**
```
Email: travunited3@gmail.com
Password: Marigudi@9
✅ Auto Confirm User: YES
```

#### **User 2: Admin**
```
Email: admin@travunited.com
Password: Admin@123
✅ Auto Confirm User: YES
```

#### **User 3: Sub Admin**
```
Email: subadmin@travunited.com
Password: SubAdmin@123
✅ Auto Confirm User: YES
```

#### **User 4: Regional Admin**
```
Email: regionaladmin@travunited.com
Password: RegionalAdmin@123
✅ Auto Confirm User: YES
```

#### **User 5: Maintenance Admin**
```
Email: maintenance@travunited.com
Password: Maintenance@123
✅ Auto Confirm User: YES
```

---

### **Step 2: Run SQL Script in Supabase SQL Editor**

1. **Go to SQL Editor:**
   ```
   https://supabase.com/dashboard/project/esbzzprfgkhccigvyuiw/sql
   ```

2. **Copy the SQL file:**
   - Open: `database/create-admin-users-all-roles.sql`
   - Select All (Cmd+A / Ctrl+A)
   - Copy (Cmd+C / Ctrl+C)

3. **Paste and Run:**
   - Paste in SQL Editor (Cmd+V / Ctrl+V)
   - Click **"Run"** button (or Cmd+Enter)

4. **Wait for Success:**
   ```
   ✅ Admin user profiles setup complete!
   📊 Created/Updated profiles: 5
   ```

---

### **Step 3: Verify Setup**

Run this query in SQL Editor to verify:

```sql
SELECT 
  au.email,
  up.full_name,
  up.role,
  up.is_active,
  up.preferences
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
WHERE up.role IN ('super_admin', 'admin', 'sub_admin', 'regional_admin', 'maintenance_admin')
ORDER BY 
  CASE up.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'sub_admin' THEN 3
    WHEN 'regional_admin' THEN 4
    WHEN 'maintenance_admin' THEN 5
  END;
```

**Expected Result:** 5 rows showing all admin users ✅

---

## 🎯 **Test Login**

Start your dev server:
```bash
npm run dev
```

Test each user:
```
1. Super Admin:     http://localhost:3000/login
   travunited3@gmail.com / Marigudi@9
   → Redirects to /super-admin

2. Admin:           http://localhost:3000/login
   admin@travunited.com / Admin@123
   → Redirects to /admin

3. Sub Admin:       http://localhost:3000/login
   subadmin@travunited.com / SubAdmin@123
   → Redirects to /admin

4. Regional Admin:  http://localhost:3000/login
   regionaladmin@travunited.com / RegionalAdmin@123
   → Redirects to /regional-admin

5. Maintenance:     http://localhost:3000/login
   maintenance@travunited.com / Maintenance@123
   → Redirects to /maintenance
```

---

## 📊 **What Each User Can Do**

### **Super Admin** (travunited3@gmail.com)
- ✅ Everything
- ✅ User management
- ✅ System configuration
- ✅ All applications (all regions)
- ✅ Analytics dashboard

### **Admin** (admin@travunited.com)
- ✅ Review applications
- ✅ Verify documents
- ✅ Approve/reject applications
- ✅ Handle support tickets
- ✅ Manage blog posts
- ❌ Cannot manage users

### **Sub Admin** (subadmin@travunited.com)
- ✅ Verify documents
- ✅ Recommend approval (not finalize)
- ✅ View assigned applications
- ❌ Cannot final approval
- ❌ Cannot manage users

### **Regional Admin** (regionaladmin@travunited.com)
- ✅ Regional operations only
- ✅ Regional analytics
- ✅ Performance metrics
- ❌ Cannot access other regions

### **Maintenance Admin** (maintenance@travunited.com)
- ✅ System health monitoring
- ✅ Database health
- ✅ Log analysis
- ❌ Cannot access user data

---

## 🎉 **That's It!**

**Total Time: 5 minutes**

1. Create 4 new users in Dashboard (2 mins)
2. Run SQL script (1 min)
3. Verify (1 min)
4. Test login (1 min)

**All 5 admin accounts ready to use!** ✅

---

## 💡 **Why Manual is Better**

The Supabase connection pooler has restrictions on DDL operations. The manual approach is:
- ✅ Faster (5 minutes vs 15+ minutes troubleshooting)
- ✅ More reliable (no connection issues)
- ✅ Official Supabase workflow
- ✅ No CLI dependencies

---

## 📚 **Reference Files**

- **SQL Script:** `database/create-admin-users-all-roles.sql`
- **Full Guide:** `ADMIN_CREDENTIALS.md`
- **This Guide:** `SUPABASE_CLI_ADMIN_SETUP.md`

---

**Status:** ✅ **Simple, Fast, Reliable**  
**Time:** ⏱️ **5 minutes total**  
**Result:** 🎉 **5 admin users ready to test**


