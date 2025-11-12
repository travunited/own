-- =====================================================
-- ADMIN SESSION TRACKING SCHEMA
-- =====================================================
-- Purpose: Track all admin login sessions for security audit
-- Features: IP tracking, device info, session management
-- Created: 2025-11-12
-- =====================================================

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    
    -- Security & Device Information
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    device_type TEXT, -- mobile, desktop, tablet
    browser TEXT, -- chrome, firefox, safari, etc.
    os TEXT, -- windows, macos, linux, ios, android
    
    -- Dashboard Access
    dashboard_type TEXT NOT NULL, -- super-admin, admin, content-manager
    
    -- Session Timing
    login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_at TIMESTAMPTZ,
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Session Status
    is_active BOOLEAN NOT NULL DEFAULT true,
    logout_reason TEXT, -- manual, timeout, forced, expired
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on user_id for quick user session lookup
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id 
ON public.admin_sessions(user_id);

-- Index on session_token for quick session validation
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token 
ON public.admin_sessions(session_token);

-- Index on is_active for filtering active sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_active 
ON public.admin_sessions(is_active);

-- Index on dashboard_type for filtering by dashboard
CREATE INDEX IF NOT EXISTS idx_admin_sessions_dashboard 
ON public.admin_sessions(dashboard_type);

-- Index on login_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_admin_sessions_login_at 
ON public.admin_sessions(login_at DESC);

-- Composite index for active sessions by user
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_active 
ON public.admin_sessions(user_id, is_active) WHERE is_active = true;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Super admins can view all sessions
CREATE POLICY "Super admins can view all sessions"
ON public.admin_sessions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'SUPER_ADMIN'
    )
);

-- Admins can view their own sessions
CREATE POLICY "Admins can view own sessions"
ON public.admin_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- System can insert sessions (for login tracking)
CREATE POLICY "System can create sessions"
ON public.admin_sessions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can update their own sessions (for logout)
CREATE POLICY "Users can update own sessions"
ON public.admin_sessions
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Super admins can force logout any session
CREATE POLICY "Super admins can update any session"
ON public.admin_sessions
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'SUPER_ADMIN'
    )
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_sessions_updated_at
    BEFORE UPDATE ON public.admin_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_sessions_updated_at();

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to auto-expire inactive sessions (older than 24 hours)
CREATE OR REPLACE FUNCTION expire_inactive_sessions()
RETURNS void AS $$
BEGIN
    UPDATE public.admin_sessions
    SET 
        is_active = false,
        logout_at = NOW(),
        logout_reason = 'timeout'
    WHERE 
        is_active = true
        AND last_activity_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Function to force logout all sessions for a user
CREATE OR REPLACE FUNCTION force_logout_user_sessions(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.admin_sessions
    SET 
        is_active = false,
        logout_at = NOW(),
        logout_reason = 'forced'
    WHERE 
        user_id = p_user_id
        AND is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Function to get active session count for user
CREATE OR REPLACE FUNCTION get_active_session_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    session_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO session_count
    FROM public.admin_sessions
    WHERE user_id = p_user_id
    AND is_active = true;
    
    RETURN session_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE QUERIES FOR ANALYTICS
-- =====================================================

-- View active sessions by dashboard type
-- SELECT 
--     dashboard_type,
--     COUNT(*) as active_sessions,
--     COUNT(DISTINCT user_id) as unique_users
-- FROM admin_sessions
-- WHERE is_active = true
-- GROUP BY dashboard_type;

-- View user login history
-- SELECT 
--     u.email,
--     s.login_at,
--     s.logout_at,
--     s.ip_address,
--     s.browser,
--     s.os,
--     s.is_active
-- FROM admin_sessions s
-- JOIN auth.users u ON s.user_id = u.id
-- ORDER BY s.login_at DESC;

-- View sessions by IP address (detect potential security issues)
-- SELECT 
--     ip_address,
--     COUNT(*) as session_count,
--     COUNT(DISTINCT user_id) as unique_users,
--     MAX(login_at) as last_login
-- FROM admin_sessions
-- GROUP BY ip_address
-- ORDER BY session_count DESC;

-- View average session duration
-- SELECT 
--     AVG(EXTRACT(EPOCH FROM (logout_at - login_at))) / 3600 as avg_hours
-- FROM admin_sessions
-- WHERE logout_at IS NOT NULL;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.admin_sessions TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.admin_sessions IS 'Tracks all admin user login sessions for security audit and monitoring';
COMMENT ON COLUMN public.admin_sessions.session_token IS 'Unique token for session validation';
COMMENT ON COLUMN public.admin_sessions.ip_address IS 'IP address from which user logged in';
COMMENT ON COLUMN public.admin_sessions.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN public.admin_sessions.dashboard_type IS 'Type of dashboard accessed (super-admin, admin, content-manager)';
COMMENT ON COLUMN public.admin_sessions.is_active IS 'Whether the session is currently active';
COMMENT ON COLUMN public.admin_sessions.logout_reason IS 'Reason for session termination (manual, timeout, forced, expired)';

-- =====================================================
-- END OF SCHEMA
-- =====================================================

