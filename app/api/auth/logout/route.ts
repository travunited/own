/**
 * Logout API Route
 * Handle user logout and session termination
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createSecurityEvent } from '@/lib/auth/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { logoutAll = false } = body;

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (logoutAll) {
      // Revoke all sessions
      await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revocation_reason: 'user_logout_all',
        })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Log session revocation
      await logSecurityEvent(supabase, {
        userId: user.id,
        eventType: 'session_revoked',
        ipAddress,
        metadata: { revokeAll: true },
        success: true,
      });
    } else {
      // Revoke current session only
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await supabase
          .from('user_sessions')
          .update({
            is_active: false,
            revoked_at: new Date().toISOString(),
            revocation_reason: 'user_logout',
          })
          .eq('session_token', session.access_token)
          .eq('user_id', user.id);
      }
    }

    // Sign out from Supabase
    await supabase.auth.signOut();

    // Log logout
    await logSecurityEvent(supabase, {
      userId: user.id,
      eventType: 'logout',
      ipAddress,
      metadata: { logoutAll },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: logoutAll ? 'Logged out from all devices' : 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper to log security events
async function logSecurityEvent(supabase: any, event: any) {
  try {
    const securityEvent = createSecurityEvent(
      event.userId,
      event.eventType,
      {
        ipAddress: event.ipAddress,
        metadata: event.metadata,
        success: event.success,
      }
    );

    await supabase.from('security_events').insert({
      user_id: securityEvent.userId,
      event_type: securityEvent.eventType,
      event_category: securityEvent.eventCategory,
      severity: securityEvent.severity,
      ip_address: securityEvent.ipAddress,
      metadata: securityEvent.metadata,
      success: securityEvent.success,
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

