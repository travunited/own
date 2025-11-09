-- ============================================
-- CREATE ADMIN USERS FOR ALL 5 ROLES
-- Run this in Supabase SQL Editor
-- ============================================

-- NOTE: Supabase auth.users requires manual creation via Dashboard or API
-- This script creates the user_profiles and assigns roles

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
-- USER CREDENTIALS TO CREATE
-- ============================================

/*
Role: Super Admin
Email: superadmin@travunited.com
Password: SuperAdmin@123
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
-- STEP 1: Get User IDs (after creating in Dashboard)
-- ============================================

-- This query will show you the user IDs after you create them
-- Run this to verify all users exist:
-- SELECT id, email FROM auth.users WHERE email LIKE '%@travunited.com';

-- ============================================
-- STEP 2: Create User Profiles with Roles
-- ============================================

-- Note: Replace the email addresses below if they don't match
-- This uses auth.users to get the user_id

-- Super Admin Profile
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  email_verified,
  is_active
)
SELECT 
  id,
  email,
  'Super Admin User',
  'super_admin',
  true,
  true
FROM auth.users
WHERE email = 'superadmin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'super_admin',
  full_name = 'Super Admin User',
  email_verified = true,
  is_active = true;

-- Admin Profile
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  email_verified,
  is_active
)
SELECT 
  id,
  email,
  'Admin User',
  'admin',
  true,
  true
FROM auth.users
WHERE email = 'admin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'admin',
  full_name = 'Admin User',
  email_verified = true,
  is_active = true;

-- Sub Admin Profile
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  email_verified,
  is_active
)
SELECT 
  id,
  email,
  'Sub Admin User',
  'sub_admin',
  true,
  true
FROM auth.users
WHERE email = 'subadmin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'sub_admin',
  full_name = 'Sub Admin User',
  email_verified = true,
  is_active = true;

-- Regional Admin Profile
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  email_verified,
  is_active
)
SELECT 
  id,
  email,
  'Regional Admin User',
  'regional_admin',
  true,
  true
FROM auth.users
WHERE email = 'regionaladmin@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'regional_admin',
  full_name = 'Regional Admin User',
  email_verified = true,
  is_active = true;

-- Maintenance Admin Profile
INSERT INTO user_profiles (
  id,
  email,
  full_name,
  role,
  email_verified,
  is_active
)
SELECT 
  id,
  email,
  'Maintenance Admin User',
  'maintenance_admin',
  true,
  true
FROM auth.users
WHERE email = 'maintenance@travunited.com'
ON CONFLICT (id) 
DO UPDATE SET 
  role = 'maintenance_admin',
  full_name = 'Maintenance Admin User',
  email_verified = true,
  is_active = true;

-- ============================================
-- STEP 3: Assign Regional Admin to a Region (Optional)
-- ============================================

-- If you have tour_regions table and want to assign the regional admin
-- UPDATE user_profiles
-- SET preferences = jsonb_set(
--   COALESCE(preferences, '{}'::jsonb),
--   '{assigned_region}',
--   '"mumbai"'
-- )
-- WHERE email = 'regionaladmin@travunited.com';

-- ============================================
-- STEP 4: Verify All Users Created
-- ============================================

-- Run this to verify all profiles exist with correct roles:
SELECT 
  up.id,
  up.email,
  up.full_name,
  up.role,
  up.email_verified,
  up.is_active,
  up.created_at
FROM user_profiles up
WHERE up.email LIKE '%@travunited.com'
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
  FROM user_profiles
  WHERE email LIKE '%@travunited.com';
  
  RAISE NOTICE '✅ Admin user profiles setup complete!';
  RAISE NOTICE '📊 Created profiles: %', profile_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Login Credentials:';
  RAISE NOTICE '';
  RAISE NOTICE '1. Super Admin:';
  RAISE NOTICE '   Email: superadmin@travunited.com';
  RAISE NOTICE '   Password: SuperAdmin@123';
  RAISE NOTICE '';
  RAISE NOTICE '2. Admin:';
  RAISE NOTICE '   Email: admin@travunited.com';
  RAISE NOTICE '   Password: Admin@123';
  RAISE NOTICE '';
  RAISE NOTICE '3. Sub Admin:';
  RAISE NOTICE '   Email: subadmin@travunited.com';
  RAISE NOTICE '   Password: SubAdmin@123';
  RAISE NOTICE '';
  RAISE NOTICE '4. Regional Admin:';
  RAISE NOTICE '   Email: regionaladmin@travunited.com';
  RAISE NOTICE '   Password: RegionalAdmin@123';
  RAISE NOTICE '';
  RAISE NOTICE '5. Maintenance Admin:';
  RAISE NOTICE '   Email: maintenance@travunited.com';
  RAISE NOTICE '   Password: Maintenance@123';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Test each role by logging in at /login';
END $$;

