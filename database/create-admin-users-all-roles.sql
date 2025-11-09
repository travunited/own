-- ============================================
-- CREATE ADMIN USERS FOR ALL 5 ROLES
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Add missing columns to user_profiles
-- ============================================

-- Add role column if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add email_verified column if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Add is_active column if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add constraint for valid roles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'valid_role' 
    AND conrelid = 'user_profiles'::regclass
  ) THEN
    ALTER TABLE user_profiles
    ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'sub_admin', 'super_admin', 'regional_admin', 'maintenance_admin'));
  END IF;
END $$;

-- Create index on role for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. First, create users in Supabase Dashboard:
--    Auth → Users → Add User
--    
-- 2. For each user, create with:
--    - Email (from list below)
--    - Password (from list below)
--    - Auto Confirm User: YES
--
-- 3. After creating users in Dashboard, run this script
--    to create profiles and assign roles

-- ============================================
-- USER CREDENTIALS TO CREATE IN DASHBOARD
-- ============================================

/*
Role: Super Admin
Email: travunited3@gmail.com
Password: Marigudi@9
Full Name: Super Admin User

Role: Admin
Email: admin@travunited.com
Password: Admin@123
Full Name: Admin User

Role: Sub Admin
Email: subadmin@travunited.com
Password: SubAdmin@123
Full Name: Sub Admin User

Role: Regional Admin
Email: regionaladmin@travunited.com
Password: RegionalAdmin@123
Full Name: Regional Admin User

Role: Maintenance Admin
Email: maintenance@travunited.com
Password: Maintenance@123
Full Name: Maintenance Admin User
*/

-- ============================================
-- STEP 2: Create User Profiles with Roles
-- ============================================

-- Super Admin Profile (existing user travunited3@gmail.com)
INSERT INTO user_profiles (
  id,
  full_name,
  role,
  email_verified,
  is_active,
  preferences
)
SELECT 
  id,
  'Super Admin User',
  'super_admin',
  true,
  true,
  '{"dashboard": "super_admin"}'::jsonb
FROM auth.users
WHERE email = 'travunited3@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'super_admin',
  full_name = 'Super Admin User',
  email_verified = true,
  is_active = true,
  preferences = jsonb_set(
    COALESCE(user_profiles.preferences, '{}'::jsonb),
    '{dashboard}',
    '"super_admin"'
  );

-- Admin Profile
INSERT INTO user_profiles (
  id,
  full_name,
  role,
  email_verified,
  is_active,
  preferences
)
SELECT 
  id,
  'Admin User',
  'admin',
  true,
  true,
  '{"dashboard": "admin"}'::jsonb
FROM auth.users
WHERE email = 'admin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'Admin User',
  email_verified = true,
  is_active = true,
  preferences = jsonb_set(
    COALESCE(user_profiles.preferences, '{}'::jsonb),
    '{dashboard}',
    '"admin"'
  );

-- Sub Admin Profile
INSERT INTO user_profiles (
  id,
  full_name,
  role,
  email_verified,
  is_active,
  preferences
)
SELECT 
  id,
  'Sub Admin User',
  'sub_admin',
  true,
  true,
  '{"dashboard": "admin"}'::jsonb
FROM auth.users
WHERE email = 'subadmin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'sub_admin',
  full_name = 'Sub Admin User',
  email_verified = true,
  is_active = true,
  preferences = jsonb_set(
    COALESCE(user_profiles.preferences, '{}'::jsonb),
    '{dashboard}',
    '"admin"'
  );

-- Regional Admin Profile
INSERT INTO user_profiles (
  id,
  full_name,
  role,
  email_verified,
  is_active,
  preferences
)
SELECT 
  id,
  'Regional Admin User',
  'regional_admin',
  true,
  true,
  '{"dashboard": "regional_admin", "assigned_region": "mumbai"}'::jsonb
FROM auth.users
WHERE email = 'regionaladmin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'regional_admin',
  full_name = 'Regional Admin User',
  email_verified = true,
  is_active = true,
  preferences = jsonb_set(
    COALESCE(user_profiles.preferences, '{}'::jsonb),
    '{dashboard}',
    '"regional_admin"'
  );

-- Maintenance Admin Profile
INSERT INTO user_profiles (
  id,
  full_name,
  role,
  email_verified,
  is_active,
  preferences
)
SELECT 
  id,
  'Maintenance Admin User',
  'maintenance_admin',
  true,
  true,
  '{"dashboard": "maintenance"}'::jsonb
FROM auth.users
WHERE email = 'maintenance@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'maintenance_admin',
  full_name = 'Maintenance Admin User',
  email_verified = true,
  is_active = true,
  preferences = jsonb_set(
    COALESCE(user_profiles.preferences, '{}'::jsonb),
    '{dashboard}',
    '"maintenance"'
  );

-- ============================================
-- STEP 3: Verify All Users Created
-- ============================================

-- Run this to verify all profiles exist with correct roles:
SELECT 
  up.id,
  au.email,
  up.full_name,
  up.role,
  up.email_verified,
  up.is_active,
  up.preferences,
  up.created_at
FROM user_profiles up
JOIN auth.users au ON au.id = up.id
WHERE au.email IN (
  'travunited3@gmail.com',
  'admin@travunited.com',
  'subadmin@travunited.com',
  'regionaladmin@travunited.com',
  'maintenance@travunited.com'
)
ORDER BY 
  CASE up.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'sub_admin' THEN 3
    WHEN 'regional_admin' THEN 4
    WHEN 'maintenance_admin' THEN 5
    ELSE 6
  END;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
DECLARE
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count
  FROM user_profiles up
  JOIN auth.users au ON au.id = up.id
  WHERE au.email IN (
    'travunited3@gmail.com',
    'admin@travunited.com',
    'subadmin@travunited.com',
    'regionaladmin@travunited.com',
    'maintenance@travunited.com'
  );
  
  RAISE NOTICE '✅ Admin user profiles setup complete!';
  RAISE NOTICE '📊 Created/Updated profiles: %', profile_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Login Credentials:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Super Admin:';
  RAISE NOTICE '   Email: travunited3@gmail.com';
  RAISE NOTICE '   Password: Marigudi@9';
  RAISE NOTICE '   Dashboard: /super-admin';
  RAISE NOTICE '';
  RAISE NOTICE '2. Admin:';
  RAISE NOTICE '   Email: admin@travunited.com';
  RAISE NOTICE '   Password: Admin@123';
  RAISE NOTICE '   Dashboard: /admin';
  RAISE NOTICE '';
  RAISE NOTICE '3. Sub Admin:';
  RAISE NOTICE '   Email: subadmin@travunited.com';
  RAISE NOTICE '   Password: SubAdmin@123';
  RAISE NOTICE '   Dashboard: /admin';
  RAISE NOTICE '';
  RAISE NOTICE '4. Regional Admin:';
  RAISE NOTICE '   Email: regionaladmin@travunited.com';
  RAISE NOTICE '   Password: RegionalAdmin@123';
  RAISE NOTICE '   Dashboard: /regional-admin';
  RAISE NOTICE '';
  RAISE NOTICE '5. Maintenance Admin:';
  RAISE NOTICE '   Email: maintenance@travunited.com';
  RAISE NOTICE '   Password: Maintenance@123';
  RAISE NOTICE '   Dashboard: /maintenance';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Test each role by logging in at /login';
  RAISE NOTICE '✨ Each user will be auto-redirected to their correct dashboard!';
END $$;
