# 🔐 Travunited Authentication & Security System

## Complete Implementation Plan

---

## 📋 Overview

A world-class authentication system with email/password, MFA, device management, and session control.

---

## 🎯 Features Breakdown

### Phase 1: Core Authentication ✅
1. **Email/Password Registration**
   - User registration with email
   - Password strength validation
   - Email verification required
   - Username/display name
   - Terms acceptance

2. **Login System**
   - Email/password authentication
   - Remember me functionality
   - Rate limiting protection
   - Brute force prevention

3. **Password Recovery**
   - Forgot password flow
   - Secure reset token generation
   - Email with reset link
   - Password reset page
   - Password confirmation

4. **Email Verification**
   - Verification email on signup
   - Resend verification option
   - Token expiration (24 hours)
   - Verified badge/status

---

### Phase 2: Multi-Factor Authentication (MFA)
1. **TOTP-based 2FA**
   - QR code generation
   - Authenticator app support (Google/Microsoft/Authy)
   - 6-digit code verification
   - Time-based one-time passwords

2. **Backup Codes**
   - 10 single-use backup codes
   - Secure generation
   - Download/print option
   - Code consumption tracking

3. **MFA Setup Wizard**
   - Step-by-step onboarding
   - QR code display
   - Test verification
   - Backup codes display
   - Success confirmation

4. **Optional Enforcement**
   - User can enable/disable
   - Admin can enforce for all
   - Role-based enforcement
   - Grace period for setup

---

### Phase 3: Device Management
1. **Device Registration**
   - Automatic on login
   - Device fingerprinting
   - Browser detection
   - OS detection
   - Location tracking

2. **Trusted Devices**
   - Mark device as trusted
   - Skip MFA on trusted devices
   - Trust expiration (30/90 days)
   - Revoke trust

3. **Device Information**
   - Device name
   - Browser & version
   - Operating system
   - IP address
   - Last used timestamp
   - Location (city/country)

4. **Device Management UI**
   - View all devices
   - Current device indicator
   - Remove devices
   - View device history

---

### Phase 4: Session Management
1. **Active Sessions**
   - Track all user sessions
   - Session ID generation
   - Session metadata storage
   - Real-time session list

2. **Session Information**
   - Login time
   - Last activity
   - Device used
   - IP address
   - Location
   - Browser info

3. **Session Control**
   - Revoke single session
   - Revoke all other sessions
   - Auto-logout inactive sessions
   - Session timeout configuration

4. **Security Events**
   - Login notifications
   - New device alerts
   - Password change alerts
   - MFA changes
   - Session revocation logs

---

## 🗄️ Database Schema

### Tables Required

#### 1. `users` (Extended Supabase auth.users)
```sql
-- Supabase handles core user table
-- We'll use user_metadata for additional fields
{
  id: uuid,
  email: string,
  email_confirmed_at: timestamp,
  encrypted_password: string,
  created_at: timestamp,
  updated_at: timestamp,
  last_sign_in_at: timestamp,
  raw_app_meta_data: jsonb,
  raw_user_meta_data: jsonb {
    full_name: string,
    avatar_url: string,
    phone: string,
    preferences: object
  }
}
```

#### 2. `user_profiles` (Application layer)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  preferences JSONB DEFAULT '{}',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `user_mfa` (Multi-Factor Authentication)
```sql
CREATE TABLE user_mfa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mfa_type VARCHAR(20) DEFAULT 'totp', -- totp, sms, email
  secret_key TEXT NOT NULL, -- Encrypted TOTP secret
  is_enabled BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  backup_codes TEXT[], -- Array of hashed backup codes
  backup_codes_used TEXT[], -- Used backup codes
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, mfa_type)
);
```

#### 4. `user_devices` (Device Management)
```sql
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT NOT NULL,
  device_name VARCHAR(255),
  device_type VARCHAR(50), -- mobile, desktop, tablet
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  ip_address INET,
  location_country VARCHAR(100),
  location_city VARCHAR(100),
  is_trusted BOOLEAN DEFAULT false,
  trust_expires_at TIMESTAMP,
  last_used_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, device_fingerprint)
);
```

#### 5. `user_sessions` (Session Tracking)
```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID REFERENCES user_devices(id) ON DELETE SET NULL,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  revoked_at TIMESTAMP,
  revoked_by UUID REFERENCES auth.users(id),
  revocation_reason TEXT
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
```

#### 6. `security_events` (Audit Log)
```sql
CREATE TABLE security_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- login, logout, password_change, mfa_enabled, etc.
  event_category VARCHAR(50) NOT NULL, -- auth, mfa, device, session, security
  severity VARCHAR(20) DEFAULT 'info', -- info, warning, critical
  ip_address INET,
  device_id UUID REFERENCES user_devices(id),
  session_id UUID REFERENCES user_sessions(id),
  metadata JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_created ON security_events(created_at);
```

#### 7. `password_reset_tokens` (Password Recovery)
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_expires ON password_reset_tokens(expires_at);
```

---

## 🔒 Security Measures

### Password Security
- ✅ Minimum 8 characters
- ✅ Require uppercase, lowercase, number, special char
- ✅ Password strength meter
- ✅ Bcrypt hashing (handled by Supabase)
- ✅ Password history (prevent reuse)
- ✅ Rate limiting on login attempts

### Session Security
- ✅ JWT tokens with short expiration (15 min access, 7 days refresh)
- ✅ HTTP-only cookies
- ✅ Secure flag on cookies
- ✅ SameSite=Strict
- ✅ CSRF protection
- ✅ Session rotation on privilege change

### MFA Security
- ✅ TOTP secret encryption at rest
- ✅ Rate limiting on MFA verification
- ✅ Backup codes hashed
- ✅ Single-use backup codes
- ✅ MFA bypass prevention

### Device Security
- ✅ Device fingerprinting (browser + OS + plugins)
- ✅ Trusted device expiration
- ✅ New device email notifications
- ✅ Suspicious login detection
- ✅ IP-based rate limiting

---

## 🎨 User Interface Components

### Authentication Pages
1. **Sign Up Page** (`/signup`)
   - Email + password form
   - Password strength indicator
   - Terms checkbox
   - Social login (future)
   - Link to login

2. **Login Page** (`/login`)
   - Email + password
   - Remember me checkbox
   - Forgot password link
   - MFA code input (if enabled)
   - Login button

3. **Forgot Password** (`/forgot-password`)
   - Email input
   - Send reset link
   - Success message
   - Resend option

4. **Reset Password** (`/reset-password`)
   - New password input
   - Confirm password
   - Password strength
   - Reset button

5. **Email Verification** (`/verify-email`)
   - Verification status
   - Resend verification
   - Success redirect

### MFA Components
1. **MFA Setup Wizard** (`/settings/security/mfa-setup`)
   - Step 1: Introduction
   - Step 2: QR Code display
   - Step 3: Enter code to verify
   - Step 4: Save backup codes
   - Step 5: Success

2. **MFA Login** (Modal/Page)
   - 6-digit code input
   - Use backup code option
   - Trust device checkbox
   - Verify button

3. **Backup Codes Display**
   - 10 codes in grid
   - Download button
   - Print button
   - Copy all
   - Warning about security

### Security Dashboard (`/settings/security`)
1. **Overview Card**
   - Password last changed
   - MFA status
   - Active sessions count
   - Trusted devices count

2. **Password Section**
   - Change password form
   - Password requirements
   - Last changed date

3. **MFA Section**
   - Enable/disable toggle
   - Setup wizard button
   - Backup codes regenerate
   - Status indicators

4. **Device Management**
   - List of devices
   - Current device badge
   - Trust/untrust actions
   - Remove device
   - Last used info

5. **Active Sessions**
   - Session list with details
   - Current session indicator
   - Revoke buttons
   - "Logout all" button

6. **Security Log**
   - Recent events
   - Event type filters
   - Date range
   - Export option

---

## 🔄 User Flows

### Registration Flow
```
1. User visits /signup
2. Fills email, password, name
3. Submits form
4. System creates user account
5. Sends verification email
6. Redirects to /verify-email page
7. User checks email
8. Clicks verification link
9. Email confirmed
10. Redirects to dashboard
```

### Login Flow (Without MFA)
```
1. User visits /login
2. Enters email + password
3. Submits form
4. System validates credentials
5. Creates session & tokens
6. Registers device
7. Logs security event
8. Redirects to dashboard
```

### Login Flow (With MFA)
```
1. User visits /login
2. Enters email + password
3. Submits form
4. System validates credentials
5. Checks MFA enabled
6. Shows MFA input modal
7. User enters TOTP code
8. System verifies code
9. Creates session
10. Redirects to dashboard
```

### MFA Setup Flow
```
1. User goes to /settings/security
2. Clicks "Enable MFA"
3. Setup wizard opens
4. Step 1: Explanation
5. Step 2: Generate & show QR
6. User scans with authenticator app
7. Step 3: Enter test code
8. System verifies code
9. Step 4: Display backup codes
10. User downloads/copies codes
11. MFA enabled
12. Success notification
```

### Password Reset Flow
```
1. User clicks "Forgot Password"
2. Enters email address
3. System generates reset token
4. Sends email with link
5. User clicks link
6. Redirects to /reset-password?token=xxx
7. Enters new password
8. Confirms password
9. System validates token
10. Updates password
11. Invalidates all sessions
12. Sends confirmation email
13. Redirects to login
```

### Device Trust Flow
```
1. User logs in
2. System fingerprints device
3. Checks if device exists
4. If new: Creates device record
5. Shows "Trust this device?" option
6. If trusted: Stores trust + expiration
7. Next login from trusted device
8. Skips MFA (if enabled)
9. Updates last_used_at
```

---

## 📦 Implementation Phases

### Phase 1: Core Auth (Week 1-2)
- [ ] Database schema setup
- [ ] Supabase Auth configuration
- [ ] Sign up page + API
- [ ] Login page + API
- [ ] Email verification
- [ ] Password reset flow
- [ ] Basic profile management
- [ ] Session handling

### Phase 2: MFA (Week 3-4)
- [ ] TOTP library integration
- [ ] MFA database tables
- [ ] QR code generation
- [ ] MFA setup wizard
- [ ] Backup codes generation
- [ ] MFA verification on login
- [ ] Trusted device logic
- [ ] MFA settings UI

### Phase 3: Device & Session (Week 5-6)
- [ ] Device fingerprinting library
- [ ] Device registration on login
- [ ] Device management UI
- [ ] Session tracking system
- [ ] Active sessions display
- [ ] Session revocation API
- [ ] Security events logging
- [ ] Email notifications

### Phase 4: Polish & Security (Week 7-8)
- [ ] Rate limiting
- [ ] Brute force protection
- [ ] Security headers
- [ ] Audit logging
- [ ] Admin security dashboard
- [ ] Security alerts
- [ ] Testing & QA
- [ ] Documentation

---

## 🛠️ Technology Stack

### Core
- **Next.js 15** - Framework
- **Supabase Auth** - Authentication backend
- **PostgreSQL** - Database
- **JWT** - Token management

### MFA
- **otplib** - TOTP generation/verification
- **qrcode** - QR code generation
- **speakeasy** - Alternative TOTP library

### Device Detection
- **ua-parser-js** - User agent parsing
- **fingerprintjs** - Device fingerprinting
- **geoip-lite** - IP geolocation

### Security
- **bcryptjs** - Password hashing (backup)
- **crypto** - Token generation
- **rate-limiter-flexible** - Rate limiting
- **helmet** - Security headers

### UI Components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

---

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
POST   /api/auth/refresh         - Refresh access token
GET    /api/auth/me              - Get current user
POST   /api/auth/verify-email    - Verify email
POST   /api/auth/resend-verification - Resend verification
```

### Password Management
```
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password with token
POST   /api/auth/change-password - Change password (authenticated)
```

### MFA
```
POST   /api/auth/mfa/setup       - Initialize MFA setup
POST   /api/auth/mfa/verify      - Verify TOTP code
POST   /api/auth/mfa/enable      - Enable MFA
POST   /api/auth/mfa/disable     - Disable MFA
POST   /api/auth/mfa/backup-codes - Generate new backup codes
POST   /api/auth/mfa/verify-backup - Verify backup code
```

### Device Management
```
GET    /api/auth/devices         - List user devices
POST   /api/auth/devices/trust   - Trust a device
DELETE /api/auth/devices/:id     - Remove device
GET    /api/auth/devices/current - Get current device
```

### Session Management
```
GET    /api/auth/sessions        - List active sessions
DELETE /api/auth/sessions/:id    - Revoke specific session
DELETE /api/auth/sessions/all    - Revoke all other sessions
GET    /api/auth/sessions/current - Get current session
```

### Security
```
GET    /api/auth/security/events - Get security events
GET    /api/auth/security/log    - Get security audit log
POST   /api/auth/security/verify-password - Verify password for sensitive actions
```

---

## 📧 Email Templates

### Verification Email
- Subject: "Verify your email - Travunited"
- Verification link
- Expires in 24 hours
- Resend option

### Password Reset Email
- Subject: "Reset your password - Travunited"
- Reset link
- Expires in 1 hour
- Security notice

### New Device Alert
- Subject: "New device login - Travunited"
- Device details
- Location
- "Not you?" action

### MFA Enabled
- Subject: "Two-factor authentication enabled"
- Confirmation
- Backup codes reminder
- Support contact

### Password Changed
- Subject: "Your password was changed"
- Confirmation
- "Not you?" action
- Support contact

---

## ✅ Success Criteria

### Functionality
- ✅ Users can register with email/password
- ✅ Email verification required
- ✅ Password reset works
- ✅ MFA can be enabled/disabled
- ✅ Backup codes work
- ✅ Devices are tracked
- ✅ Sessions are manageable
- ✅ Security events logged

### Security
- ✅ Passwords hashed securely
- ✅ Tokens properly secured
- ✅ Rate limiting active
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention
- ✅ Session hijacking prevention

### User Experience
- ✅ Smooth registration flow
- ✅ Clear error messages
- ✅ Helpful feedback
- ✅ Easy MFA setup
- ✅ Intuitive security dashboard
- ✅ Mobile-friendly
- ✅ Fast performance

---

**Ready to implement the most secure authentication system!** 🔒


