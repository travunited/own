/**
 * Reset Password API Route
 * Handle password reset with token
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { validatePassword } from '@/lib/auth/password';
import { verifyToken, isTokenExpired } from '@/lib/auth/tokens';
import { createSecurityEvent } from '@/lib/auth/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          requirements: passwordValidation.requirements,
        },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Verify token from our database
    const { data: resetToken } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .eq('is_used', false)
      .single();

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (isTokenExpired(new Date(resetToken.expires_at))) {
      return NextResponse.json(
        { error: 'Reset token has expired' },
        { status: 400 }
      );
    }

    // Update password using Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      await logSecurityEvent(supabase, {
        userId: resetToken.user_id,
        eventType: 'password_reset_complete',
        ipAddress,
        metadata: { reason: error.message },
        success: false,
        errorMessage: error.message,
      });

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq('id', resetToken.id);

    // Revoke all existing sessions for security
    await supabase
      .from('user_sessions')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString(),
        revocation_reason: 'password_reset',
      })
      .eq('user_id', resetToken.user_id)
      .eq('is_active', true);

    // Log successful password reset
    await logSecurityEvent(supabase, {
      userId: resetToken.user_id,
      eventType: 'password_reset_complete',
      ipAddress,
      metadata: { allSessionsRevoked: true },
      success: true,
    });

    // Log password change
    await logSecurityEvent(supabase, {
      userId: resetToken.user_id,
      eventType: 'password_change',
      ipAddress,
      metadata: { method: 'reset' },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully. Please login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
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
        errorMessage: event.errorMessage,
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
      error_message: securityEvent.errorMessage,
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

