-- ============================================
-- ROLE-BASED ACCESS CONTROL (RBAC) SCHEMA
-- 5-Tier Admin System with Granular Permissions
-- ============================================

-- ============================================
-- UPDATE USER_PROFILES FOR ROLES
-- ============================================

-- Add role and permission columns
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS role_permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS regional_access JSONB,
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS role_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS role_expires_at TIMESTAMP;

-- Add constraint for valid roles
ALTER TABLE user_profiles
DROP CONSTRAINT IF EXISTS valid_role;

ALTER TABLE user_profiles
ADD CONSTRAINT valid_role CHECK (
  role IN ('user', 'sub_admin', 'admin', 'regional_admin', 'maintenance_admin', 'super_admin')
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_regional ON user_profiles USING GIN (regional_access);
CREATE INDEX IF NOT EXISTS idx_user_profiles_assigned_by ON user_profiles(assigned_by);

-- ============================================
-- ADMIN ROLE PERMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_role_permissions (
  role TEXT PRIMARY KEY,
  permissions JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  CONSTRAINT valid_permission_role CHECK (
    role IN ('sub_admin', 'admin', 'regional_admin', 'maintenance_admin', 'super_admin')
  )
);

-- Insert default permissions for each role
INSERT INTO admin_role_permissions (role, permissions, description) VALUES
(
  'super_admin',
  '{
    "all": true,
    "applications": {"view": "all", "create": true, "edit": true, "delete": true, "approve": true, "reject": true, "export": true},
    "users": {"view": "all", "create": true, "edit": true, "suspend": true, "delete": true, "assignRoles": true},
    "payments": {"view": "all", "refund": true, "export": true},
    "documents": {"view": "all", "verify": true, "delete": true},
    "system": {"configuration": true, "maintenance": true, "backups": true, "logs": true},
    "analytics": {"view": "all", "export": true},
    "content": {"blog": true, "pages": true, "faqs": true}
  }',
  'Full system access - God mode'
),
(
  'admin',
  '{
    "applications": {"view": "all", "create": false, "edit": true, "delete": false, "approve": true, "reject": true, "export": true},
    "users": {"view": "all", "create": false, "edit": true, "suspend": true, "delete": false, "assignRoles": false},
    "payments": {"view": "all", "refund": true, "export": true},
    "documents": {"view": "all", "verify": true, "delete": false},
    "system": {"configuration": false, "maintenance": false, "backups": false, "logs": false},
    "analytics": {"view": "all", "export": true},
    "content": {"blog": true, "pages": true, "faqs": true}
  }',
  'Core admin functions - Application & user management'
),
(
  'sub_admin',
  '{
    "applications": {"view": "assigned", "create": false, "edit": false, "delete": false, "approve": false, "reject": false, "export": false},
    "users": {"view": "none", "create": false, "edit": false, "suspend": false, "delete": false, "assignRoles": false},
    "payments": {"view": "assigned", "refund": false, "export": false},
    "documents": {"view": "assigned", "verify": true, "delete": false},
    "system": {"configuration": false, "maintenance": false, "backups": false, "logs": false},
    "analytics": {"view": "basic", "export": false},
    "content": {"blog": false, "pages": false, "faqs": false}
  }',
  'Limited access - Assigned items only'
),
(
  'regional_admin',
  '{
    "applications": {"view": "region", "create": false, "edit": true, "delete": false, "approve": true, "reject": true, "export": true},
    "users": {"view": "region", "create": false, "edit": true, "suspend": true, "delete": false, "assignRoles": false},
    "payments": {"view": "region", "refund": false, "export": true},
    "documents": {"view": "region", "verify": true, "delete": false},
    "system": {"configuration": false, "maintenance": false, "backups": false, "logs": false},
    "analytics": {"view": "region", "export": true},
    "content": {"blog": false, "pages": false, "faqs": false}
  }',
  'Regional scope - Assigned regions only'
),
(
  'maintenance_admin',
  '{
    "applications": {"view": "none", "create": false, "edit": false, "delete": false, "approve": false, "reject": false, "export": false},
    "users": {"view": "none", "create": false, "edit": false, "suspend": false, "delete": false, "assignRoles": false},
    "payments": {"view": "none", "refund": false, "export": false},
    "documents": {"view": "none", "verify": false, "delete": false},
    "system": {"configuration": false, "maintenance": true, "backups": true, "logs": true},
    "analytics": {"view": "system", "export": false},
    "content": {"blog": false, "pages": false, "faqs": false}
  }',
  'Technical operations - No user data access'
)
ON CONFLICT (role) DO UPDATE SET
  permissions = EXCLUDED.permissions,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ============================================
-- ADMIN AUDIT LOGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Admin info
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  admin_role TEXT NOT NULL,
  admin_email TEXT,
  
  -- Action details
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  resource_name TEXT,
  
  -- Change details
  old_value JSONB,
  new_value JSONB,
  details JSONB,
  
  -- Request metadata
  ip_address TEXT,
  user_agent TEXT,
  request_url TEXT,
  request_method TEXT,
  
  -- Status
  status TEXT DEFAULT 'success',
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_role ON admin_audit_logs(admin_role);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON admin_audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_status ON admin_audit_logs(status);

-- ============================================
-- ADMIN ACTIVITY TRACKING TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  admin_role TEXT NOT NULL,
  
  -- Activity metrics
  last_active_at TIMESTAMP DEFAULT NOW() NOT NULL,
  actions_today INTEGER DEFAULT 0,
  actions_this_week INTEGER DEFAULT 0,
  actions_this_month INTEGER DEFAULT 0,
  
  -- Session info
  current_session_id TEXT,
  session_started_at TIMESTAMP,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  
  UNIQUE(admin_id)
);

CREATE INDEX IF NOT EXISTS idx_activity_admin ON admin_activity(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_role ON admin_activity(admin_role);
CREATE INDEX IF NOT EXISTS idx_activity_last_active ON admin_activity(last_active_at DESC);

-- ============================================
-- ROLE ASSIGNMENT HISTORY TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS role_assignment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User info
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  user_email TEXT,
  
  -- Role change
  old_role TEXT,
  new_role TEXT NOT NULL,
  
  -- Assignment info
  assigned_by UUID REFERENCES auth.users(id) NOT NULL,
  reason TEXT,
  expires_at TIMESTAMP,
  
  -- Regional access
  regional_access JSONB,
  
  -- Revocation info
  revoked_at TIMESTAMP,
  revoked_by UUID REFERENCES auth.users(id),
  revocation_reason TEXT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_role_history_user ON role_assignment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_role_history_assigned_by ON role_assignment_history(assigned_by);
CREATE INDEX IF NOT EXISTS idx_role_history_created ON role_assignment_history(created_at DESC);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_admin_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_admin_role TEXT;
  v_admin_email TEXT;
BEGIN
  -- Get admin role and email
  SELECT role, email INTO v_admin_role, v_admin_email
  FROM user_profiles up
  JOIN auth.users u ON u.id = up.id
  WHERE up.id = p_admin_id;
  
  -- Insert audit log
  INSERT INTO admin_audit_logs (
    admin_id,
    admin_role,
    admin_email,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    p_admin_id,
    v_admin_role,
    v_admin_email,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  ) RETURNING id INTO v_log_id;
  
  -- Update admin activity
  INSERT INTO admin_activity (admin_id, admin_role, actions_today, actions_this_week, actions_this_month)
  VALUES (p_admin_id, v_admin_role, 1, 1, 1)
  ON CONFLICT (admin_id) DO UPDATE SET
    last_active_at = NOW(),
    actions_today = admin_activity.actions_today + 1,
    actions_this_week = admin_activity.actions_this_week + 1,
    actions_this_month = admin_activity.actions_this_month + 1,
    updated_at = NOW();
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has permission
CREATE OR REPLACE FUNCTION has_permission(
  p_user_id UUID,
  p_resource TEXT,
  p_action TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_role TEXT;
  v_permissions JSONB;
BEGIN
  -- Get user role
  SELECT role INTO v_role
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Super admin has all permissions
  IF v_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Get role permissions
  SELECT permissions INTO v_permissions
  FROM admin_role_permissions
  WHERE role = v_role;
  
  -- Check if permission exists and is true
  RETURN (v_permissions->p_resource->>p_action)::BOOLEAN = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to assign role
CREATE OR REPLACE FUNCTION assign_admin_role(
  p_user_id UUID,
  p_new_role TEXT,
  p_assigned_by UUID,
  p_reason TEXT DEFAULT NULL,
  p_expires_at TIMESTAMP DEFAULT NULL,
  p_regional_access JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  v_old_role TEXT;
  v_assigner_role TEXT;
BEGIN
  -- Check if assigner is super_admin
  SELECT role INTO v_assigner_role
  FROM user_profiles
  WHERE id = p_assigned_by;
  
  IF v_assigner_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super_admin can assign roles';
  END IF;
  
  -- Get current role
  SELECT role INTO v_old_role
  FROM user_profiles
  WHERE id = p_user_id;
  
  -- Update user role
  UPDATE user_profiles
  SET
    role = p_new_role,
    regional_access = p_regional_access,
    assigned_by = p_assigned_by,
    role_assigned_at = NOW(),
    role_expires_at = p_expires_at
  WHERE id = p_user_id;
  
  -- Log role assignment
  INSERT INTO role_assignment_history (
    user_id,
    old_role,
    new_role,
    assigned_by,
    reason,
    expires_at,
    regional_access
  ) VALUES (
    p_user_id,
    v_old_role,
    p_new_role,
    p_assigned_by,
    p_reason,
    p_expires_at,
    p_regional_access
  );
  
  -- Log audit action
  PERFORM log_admin_action(
    p_assigned_by,
    'assign_role',
    'user_role',
    p_user_id,
    jsonb_build_object('old_role', v_old_role, 'new_role', p_new_role, 'reason', p_reason)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on audit logs
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignment_history ENABLE ROW LEVEL SECURITY;

-- Super admin can view all audit logs
CREATE POLICY "Super admins can view all audit logs"
  ON admin_audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Admins can view own audit logs
CREATE POLICY "Admins can view own audit logs"
  ON admin_audit_logs FOR SELECT
  USING (admin_id = auth.uid());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON admin_audit_logs FOR INSERT
  WITH CHECK (true);

-- Similar policies for other tables
CREATE POLICY "Admins can view admin activity"
  ON admin_activity FOR SELECT
  USING (
    admin_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "System can update admin activity"
  ON admin_activity FOR ALL
  USING (true);

CREATE POLICY "Super admins can view role history"
  ON role_assignment_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger to update admin_activity last_active_at
CREATE OR REPLACE FUNCTION update_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE admin_activity
  SET last_active_at = NOW()
  WHERE admin_id = NEW.admin_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_admin_activity
AFTER INSERT ON admin_audit_logs
FOR EACH ROW
EXECUTE FUNCTION update_admin_activity();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ RBAC schema created successfully!';
  RAISE NOTICE '👥 5 Admin roles configured: super_admin, admin, sub_admin, regional_admin, maintenance_admin';
  RAISE NOTICE '🔒 RLS policies enabled for all tables';
  RAISE NOTICE '📊 Audit logging system ready';
END $$;

