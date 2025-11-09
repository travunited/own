# 🔐 Role-Based Access Control (RBAC) System

## Complete Admin Hierarchy & Permissions

---

## 🎯 Overview

A comprehensive five-tier admin system with granular permissions, role-based routing, and secure access control.

---

## 👥 ADMIN ROLES HIERARCHY

```
┌─────────────────────────────────────────────┐
│           SUPER ADMIN (God Mode)            │
│  /super-admin - Full System Access          │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│              ADMIN (Management)             │
│  /admin - Core Admin Functions              │
└─────────────────────────────────────────────┘
                    ▼
┌──────────────────┬──────────────────────────┐
│   SUB ADMIN      │    REGIONAL ADMIN        │
│   /admin         │    /regional-admin       │
│   Limited Access │    Regional Scope        │
└──────────────────┴──────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│        MAINTENANCE ADMIN (Technical)        │
│  /maintenance - System Operations           │
└─────────────────────────────────────────────┘
```

---

## 🔑 ROLE DEFINITIONS

### 1. Super Admin (`super_admin`)

**Route:** `/super-admin`

**Full System Access:**
```
✅ User role management
✅ Assign/revoke admin roles
✅ System configuration
✅ Global settings
✅ All analytics and reports
✅ Payment management (full)
✅ Refund processing
✅ Country/visa management
✅ Create/edit/delete visa types
✅ Pricing configuration
✅ API key management
✅ Webhook configuration
✅ Database management
✅ Audit logs (all)
✅ Security settings
✅ Email templates
✅ SMS configuration
✅ Integration settings
✅ Delete any user
✅ Ban/suspend users
✅ Access all regions
✅ Override any decision
✅ Export sensitive data
```

**Unique Features:**
- Can promote/demote admins
- Can delete other admins
- System-wide configuration
- Access to sensitive data
- Financial controls
- Compliance reports

---

### 2. Admin (`admin`)

**Route:** `/admin`

**Core Admin Functions:**
```
✅ Application management (all)
✅ View/edit/approve/reject applications
✅ User management
✅ View user profiles
✅ Suspend users (not delete)
✅ Payment oversight
✅ View all payments
✅ Issue refunds (with approval)
✅ Document verification
✅ Approve/reject documents
✅ Status updates
✅ Change application status
✅ Analytics & reports
✅ Regional reports
✅ Performance metrics
✅ Communication
✅ Email users
✅ Support tickets
✅ Content management
✅ Blog posts
✅ FAQs
✅ Reviews moderation

❌ Cannot: Assign roles
❌ Cannot: System configuration
❌ Cannot: Delete users permanently
❌ Cannot: Manage visa types/pricing
❌ Cannot: API configurations
```

**Dashboard:**
- Application queue
- User list
- Payment overview
- Document verification
- Support center
- Content editor

---

### 3. Sub Admin (`sub_admin`)

**Route:** `/admin` (limited views)

**Limited Admin Access:**
```
✅ Limited application access
✅ View applications (assigned only)
✅ Basic user support
✅ Respond to tickets
✅ Basic user info
✅ Document verification
✅ Approve/reject documents
✅ View payment status
✅ Basic reports

❌ Cannot: Manage users
❌ Cannot: Create/delete applications
❌ Cannot: Issue refunds
❌ Cannot: Change critical status
❌ Cannot: Access analytics
❌ Cannot: Manage content
❌ Cannot: View all applications
❌ Cannot: Export data
```

**Dashboard:**
- Assigned applications
- Document queue
- Support tickets (assigned)
- Basic activity log

**Restrictions:**
- Can only see assigned items
- Cannot access user management
- Cannot modify settings
- Cannot export data

---

### 4. Regional Admin (`regional_admin`)

**Route:** `/regional-admin`

**Regional Scope:**
```
✅ Regional application access
✅ All applications in assigned region(s)
✅ Regional reports
✅ Statistics for region
✅ Performance metrics
✅ Regional user management
✅ Users in assigned region
✅ Regional communication
✅ Regional payment overview
✅ Limited to specific regions
✅ Assigned by country/state

❌ Cannot: Access other regions
❌ Cannot: Global settings
❌ Cannot: Assign roles
❌ Cannot: System configuration
❌ Cannot: Create visa types
```

**Regional Assignments:**
```javascript
{
  region_type: 'country' | 'state' | 'city',
  regions: ['India', 'Thailand', ...],
  permissions: {
    view_applications: true,
    modify_applications: true,
    manage_users: true,
    view_reports: true,
    export_data: false
  }
}
```

**Dashboard:**
- Regional overview
- Applications (region filtered)
- Users (region filtered)
- Regional analytics
- Regional support

---

### 5. Maintenance Admin (`maintenance_admin`)

**Route:** `/maintenance`

**Technical Operations:**
```
✅ System maintenance tasks
✅ Server health monitoring
✅ Database backups
✅ Trigger manual backups
✅ Restore from backup (with approval)
✅ Technical operations
✅ Clear cache
✅ Rebuild indexes
✅ Run migrations
✅ Log management
✅ View system logs
✅ Error tracking
✅ Performance monitoring

❌ Cannot: Access user data
❌ Cannot: View applications
❌ Cannot: Manage users
❌ Cannot: View payments
❌ Cannot: Access documents
❌ Cannot: Change business logic
```

**Dashboard:**
- System health
- Server metrics
- Database status
- Backup logs
- Error logs
- Performance graphs

**Security:**
- Cannot view PII
- Cannot access user content
- Cannot modify business data
- Audit logged separately

---

## 🗄️ DATABASE SCHEMA

### Updated `user_profiles` Table

```sql
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS role_permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS regional_access JSONB,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS role_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS role_expires_at TIMESTAMP,
ADD CONSTRAINT valid_role CHECK (role IN ('user', 'sub_admin', 'admin', 'regional_admin', 'maintenance_admin', 'super_admin'));

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_regional ON user_profiles USING GIN (regional_access);
```

### `admin_audit_logs` Table

```sql
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  admin_role TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_audit_action ON admin_audit_logs(action);
CREATE INDEX idx_audit_created ON admin_audit_logs(created_at DESC);
```

### `admin_role_permissions` Table

```sql
CREATE TABLE admin_role_permissions (
  role TEXT PRIMARY KEY,
  permissions JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO admin_role_permissions (role, permissions, description) VALUES
('super_admin', '{"all": true}', 'Full system access'),
('admin', '{"applications": ["view", "edit", "approve", "reject"], "users": ["view", "suspend"], "payments": ["view", "refund"], "documents": ["verify"], "content": ["edit"]}', 'Core admin functions'),
('sub_admin', '{"applications": ["view_assigned"], "documents": ["verify"], "support": ["respond"]}', 'Limited access'),
('regional_admin', '{"applications": ["view_region", "edit_region"], "users": ["view_region"], "reports": ["view_region"]}', 'Regional scope'),
('maintenance_admin', '{"system": ["maintenance", "backup", "logs"], "monitor": ["view"]}', 'Technical operations');
```

---

## 🔒 PERMISSION SYSTEM

### Permission Structure

```typescript
interface RolePermissions {
  // Applications
  applications?: {
    view: 'all' | 'assigned' | 'region' | 'none';
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
    reject: boolean;
    export: boolean;
  };
  
  // Users
  users?: {
    view: 'all' | 'region' | 'none';
    create: boolean;
    edit: boolean;
    suspend: boolean;
    delete: boolean;
    assignRoles: boolean;
  };
  
  // Payments
  payments?: {
    view: 'all' | 'region' | 'none';
    refund: boolean;
    export: boolean;
  };
  
  // Documents
  documents?: {
    view: 'all' | 'assigned' | 'none';
    verify: boolean;
    delete: boolean;
  };
  
  // System
  system?: {
    configuration: boolean;
    maintenance: boolean;
    backups: boolean;
    logs: boolean;
  };
  
  // Analytics
  analytics?: {
    view: 'all' | 'region' | 'basic' | 'none';
    export: boolean;
  };
  
  // Content
  content?: {
    blog: boolean;
    pages: boolean;
    faqs: boolean;
  };
}
```

### Permission Checking

```typescript
// lib/rbac/permissions.ts

export function hasPermission(
  userRole: string,
  resource: string,
  action: string
): boolean {
  const permissions = ROLE_PERMISSIONS[userRole];
  
  if (!permissions) return false;
  
  // Super admin has all permissions
  if (userRole === 'super_admin') return true;
  
  // Check specific permission
  return permissions[resource]?.[action] === true;
}

export function canAccessRegion(
  userRole: string,
  userRegions: string[],
  targetRegion: string
): boolean {
  // Super admin and admin can access all regions
  if (['super_admin', 'admin'].includes(userRole)) return true;
  
  // Regional admin can only access assigned regions
  if (userRole === 'regional_admin') {
    return userRegions.includes(targetRegion);
  }
  
  return false;
}
```

---

## 🛡️ MIDDLEWARE & PROTECTION

### Route Protection

```typescript
// middleware/adminAuth.ts

export async function requireRole(
  requiredRoles: string[],
  req: Request
) {
  const user = await getAuthUser(req);
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const userRole = await getUserRole(user.id);
  
  if (!requiredRoles.includes(userRole)) {
    throw new Error('Insufficient permissions');
  }
  
  // Log access
  await logAudit({
    admin_id: user.id,
    admin_role: userRole,
    action: 'access',
    resource_type: req.url,
  });
  
  return { user, role: userRole };
}
```

### API Route Protection

```typescript
// In API routes
export async function GET(request: NextRequest) {
  // Require admin or higher
  const { user, role } = await requireRole(
    ['super_admin', 'admin', 'sub_admin'],
    request
  );
  
  // Check specific permission
  if (!hasPermission(role, 'applications', 'view')) {
    return NextResponse.json(
      { error: 'Permission denied' },
      { status: 403 }
    );
  }
  
  // Filter by role
  let query = supabase.from('visa_applications').select('*');
  
  if (role === 'sub_admin') {
    // Only assigned applications
    query = query.eq('assigned_to', user.id);
  } else if (role === 'regional_admin') {
    // Only regional applications
    const regions = await getUserRegions(user.id);
    query = query.in('region', regions);
  }
  
  const { data } = await query;
  return NextResponse.json({ data });
}
```

---

## 🎨 ADMIN LAYOUTS

### Layout Structure

```
/super-admin
  ├─ /dashboard
  ├─ /users
  ├─ /roles
  ├─ /settings
  ├─ /analytics
  └─ /system

/admin
  ├─ /dashboard
  ├─ /applications
  ├─ /users
  ├─ /payments
  ├─ /documents
  └─ /content

/regional-admin
  ├─ /dashboard
  ├─ /applications (filtered)
  ├─ /users (filtered)
  └─ /reports

/maintenance
  ├─ /dashboard
  ├─ /health
  ├─ /backups
  └─ /logs
```

---

## 🔄 ROLE MANAGEMENT WORKFLOW

### Assigning Roles (Super Admin Only)

```typescript
POST /api/admin/users/[id]/assign-role

Body: {
  role: 'admin' | 'sub_admin' | 'regional_admin' | 'maintenance_admin',
  regionalAccess?: {
    type: 'country' | 'state',
    regions: string[]
  },
  expiresAt?: Date
}

Process:
1. Verify requester is super_admin
2. Validate target role
3. Update user_profiles.role
4. Set regional_access if applicable
5. Set expiration if temporary
6. Log audit event
7. Send notification to user
```

### Role Expiration

```typescript
// Cron job: Check expired roles daily
async function checkExpiredRoles() {
  const expiredAdmins = await supabase
    .from('user_profiles')
    .select('*')
    .not('role', 'eq', 'user')
    .lt('role_expires_at', new Date())
    .is('role_expires_at', 'not', null);
  
  for (const admin of expiredAdmins) {
    // Revert to user role
    await supabase
      .from('user_profiles')
      .update({
        role: 'user',
        role_permissions: {},
        regional_access: null
      })
      .eq('id', admin.id);
    
    // Send notification
    await sendRoleExpiredEmail(admin);
    
    // Log
    await logAudit({
      action: 'role_expired',
      resource_type: 'user_role',
      resource_id: admin.id
    });
  }
}
```

---

## 📊 ADMIN DASHBOARDS

### Super Admin Dashboard

```typescript
Features:
- System overview (all metrics)
- User role distribution chart
- Recent admin actions
- System health
- Payment summary (all time)
- Quick actions:
  - Assign roles
  - System settings
  - View audit logs
  - Manage visa types
```

### Admin Dashboard

```typescript
Features:
- Application queue (all)
- Recent payments
- Document verification queue
- User activity
- Support tickets
- Quick actions:
  - New application
  - Verify documents
  - Manage users
  - View reports
```

### Sub Admin Dashboard

```typescript
Features:
- Assigned applications only
- My document queue
- My support tickets
- Quick actions:
  - Verify documents
  - Respond to tickets
```

### Regional Admin Dashboard

```typescript
Features:
- Regional overview
- Applications (my regions)
- Users (my regions)
- Regional analytics
- Regional map view
- Quick actions:
  - View applications
  - Regional reports
```

### Maintenance Admin Dashboard

```typescript
Features:
- System health metrics
- Server status
- Database metrics
- Backup status
- Error logs
- Quick actions:
  - Trigger backup
  - Clear cache
  - View logs
```

---

## 🔐 SECURITY MEASURES

```
✅ Role-based routing
✅ Permission checking on every API call
✅ Audit logging for all admin actions
✅ IP logging
✅ Rate limiting per role
✅ Session timeout
✅ MFA requirement for sensitive actions
✅ Admin activity monitoring
✅ Anomaly detection
✅ Regional data isolation
✅ Sensitive data masking
✅ Secure role assignment
✅ Role expiration support
```

---

## ✅ IMPLEMENTATION CHECKLIST

```
□ Update database schema (roles, permissions, audit logs)
□ Create RBAC utility library
□ Implement permission checking functions
□ Create route protection middleware
□ Build Super Admin dashboard
□ Build Admin dashboard
□ Build Sub Admin dashboard
□ Build Regional Admin dashboard
□ Build Maintenance Admin dashboard
□ Create role assignment UI
□ Implement audit logging
□ Add role-based API filters
□ Test all permission combinations
□ Security review
□ Documentation
```

---

## 🎯 READY TO IMPLEMENT

Complete RBAC system planned with:
- ✅ 5 distinct admin roles
- ✅ Granular permissions
- ✅ Regional access control
- ✅ Audit logging
- ✅ Role management
- ✅ Security measures

**Time to build the complete admin infrastructure!** 🚀


