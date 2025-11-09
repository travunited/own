-- ============================================
-- CREATE ADMIN USER
-- Email: travunited3@gmail.com
-- Password: Marigudi@9
-- ============================================

-- Create the admin user in auth.users
-- Note: This uses Supabase's auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'travunited3@gmail.com',
  crypt('Marigudi@9', gen_salt('bf')),
  NOW(),
  NOW(),
  '',
  NOW(),
  '',
  NOW(),
  '',
  '',
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Admin User", "role": "admin"}',
  false,
  NOW(),
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NOW(),
  '',
  0,
  NULL,
  '',
  NOW(),
  false,
  NULL
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = NOW();

-- Get the user ID for the admin user
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'travunited3@gmail.com';
  
  -- Create user profile with admin role
  INSERT INTO user_profiles (
    id,
    username,
    full_name,
    preferences,
    is_verified
  ) VALUES (
    admin_user_id,
    'admin',
    'Admin User',
    '{"role": "admin", "is_admin": true}'::jsonb,
    true
  ) ON CONFLICT (id) DO UPDATE SET
    preferences = EXCLUDED.preferences,
    is_verified = true,
    updated_at = NOW();
  
  RAISE NOTICE 'Admin user created successfully with ID: %', admin_user_id;
END $$;

-- Verify admin user was created
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email = 'travunited3@gmail.com';

SELECT '✅ Admin user created: travunited3@gmail.com' as status;

