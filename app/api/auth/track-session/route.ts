import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let deviceType = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    deviceType = 'mobile';
  }
  
  // Detect browser
  let browser = 'unknown';
  if (ua.includes('edg/')) browser = 'edge';
  else if (ua.includes('chrome/')) browser = 'chrome';
  else if (ua.includes('firefox/')) browser = 'firefox';
  else if (ua.includes('safari/') && !ua.includes('chrome')) browser = 'safari';
  else if (ua.includes('opera/') || ua.includes('opr/')) browser = 'opera';
  
  // Detect OS
  let os = 'unknown';
  if (ua.includes('win')) os = 'windows';
  else if (ua.includes('mac')) os = 'macos';
  else if (ua.includes('linux')) os = 'linux';
  else if (ua.includes('android')) os = 'android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'ios';
  
  return { deviceType, browser, os };
}

// Helper function to get client IP
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

// POST - Create new session on login
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { dashboardType } = body;
    
    if (!dashboardType) {
      return NextResponse.json(
        { error: 'Dashboard type is required' },
        { status: 400 }
      );
    }
    
    // Get request details
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ipAddress = getClientIP(request);
    const { deviceType, browser, os } = parseUserAgent(userAgent);
    
    // Generate unique session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // Create session record
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        user_id: user.id,
        session_token: sessionToken,
        ip_address: ipAddress,
        user_agent: userAgent,
        device_type: deviceType,
        browser: browser,
        os: os,
        dashboard_type: dashboardType,
        is_active: true,
      })
      .select()
      .single();
    
    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      session: session,
      sessionToken: sessionToken,
    });
    
  } catch (error) {
    console.error('Session tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update session activity or logout
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { sessionToken, action, logoutReason } = body;
    
    if (!sessionToken || !action) {
      return NextResponse.json(
        { error: 'Session token and action are required' },
        { status: 400 }
      );
    }
    
    // Update session based on action
    if (action === 'logout') {
      const { error: updateError } = await supabase
        .from('admin_sessions')
        .update({
          is_active: false,
          logout_at: new Date().toISOString(),
          logout_reason: logoutReason || 'manual',
        })
        .eq('session_token', sessionToken)
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error logging out session:', updateError);
        return NextResponse.json(
          { error: 'Failed to logout session' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Session logged out successfully',
      });
    }
    
    if (action === 'update_activity') {
      const { error: updateError } = await supabase
        .from('admin_sessions')
        .update({
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_token', sessionToken)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (updateError) {
        console.error('Error updating session activity:', updateError);
        return NextResponse.json(
          { error: 'Failed to update session activity' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Session activity updated',
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Session update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get active sessions for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get active sessions for user
    const { data: sessions, error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('login_at', { ascending: false });
    
    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      sessions: sessions,
      count: sessions.length,
    });
    
  } catch (error) {
    console.error('Session fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

