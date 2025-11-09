/**
 * Session Management API Route
 * Revoke a specific session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createSecurityEvent } from '@/lib/auth/security';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Revoke session
    const { error } = await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revoked_by: user.id,
        revocation_reason: 'user_revoke',
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      throw error;
    }

    // Log session revocation
    await logSecurityEvent(supabase, {
      userId: user.id,
      eventType: 'session_revoked',
      ipAddress,
      sessionId: id,
      metadata: {},
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error) {
    console.error('Revoke session error:', error);
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
        sessionId: event.sessionId,
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
      session_id: securityEvent.sessionId,
      metadata: securityEvent.metadata,
      success: securityEvent.success,
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

