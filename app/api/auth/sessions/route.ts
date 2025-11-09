/**
 * Sessions API Route
 * List and manage user sessions
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createSecurityEvent } from '@/lib/auth/security';

export async function GET(request: NextRequest) {
  try {
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

    // Get user sessions with device info
    const { data: sessions, error } = await supabase
      .from('user_sessions')
      .select(`
        *,
        device:user_devices(*)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('last_activity_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      sessions: sessions || [],
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { revokeAll = false } = body;

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

    if (revokeAll) {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      // Revoke all sessions except current
      await supabase
        .from('user_sessions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString(),
          revoked_by: user.id,
          revocation_reason: 'user_revoke_all',
        })
        .eq('user_id', user.id)
        .eq('is_active', true)
        .neq('session_token', session?.access_token || '');

      // Log session revocation
      await logSecurityEvent(supabase, {
        userId: user.id,
        eventType: 'session_revoked',
        ipAddress,
        metadata: { revokeAll: true },
        success: true,
      });

      return NextResponse.json({
        success: true,
        message: 'All other sessions revoked successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Revoke sessions error:', error);
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

