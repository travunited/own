/**
 * MFA Enable API Route
 * Enable MFA after verification
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createSecurityEvent } from '@/lib/auth/security';

export async function POST(request: NextRequest) {
  try {
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

    // Get MFA record
    const { data: mfaData } = await supabase
      .from('user_mfa')
      .select('*')
      .eq('user_id', user.id)
      .eq('mfa_type', 'totp')
      .single();

    if (!mfaData) {
      return NextResponse.json(
        { error: 'MFA not set up' },
        { status: 400 }
      );
    }

    if (!mfaData.is_verified) {
      return NextResponse.json(
        { error: 'MFA must be verified before enabling' },
        { status: 400 }
      );
    }

    // Enable MFA
    await supabase
      .from('user_mfa')
      .update({
        is_enabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', mfaData.id);

    // Log MFA enabled
    await logSecurityEvent(supabase, {
      userId: user.id,
      eventType: 'mfa_enabled',
      ipAddress,
      metadata: { method: 'totp' },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication enabled successfully',
    });
  } catch (error) {
    console.error('MFA enable error:', error);
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

