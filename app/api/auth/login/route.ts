/**
 * Login API Route
 * Handle user authentication
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getDeviceInfo } from '@/lib/auth/device';
import { createSecurityEvent } from '@/lib/auth/security';
import { createSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = false, mfaCode } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get device and IP info
    const userAgent = request.headers.get('user-agent') || '';
    const deviceInfo = getDeviceInfo(userAgent);
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Log failed login
      await logSecurityEvent(supabase, {
        userId: undefined,
        eventType: 'login_failed',
        ipAddress,
        metadata: { email, reason: error.message },
        success: false,
        errorMessage: error.message,
      });

      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    // Check if MFA is enabled
    const { data: mfaData } = await supabase
      .from('user_mfa')
      .select('*')
      .eq('user_id', data.user.id)
      .eq('is_enabled', true)
      .single();

    if (mfaData && !mfaCode) {
      // MFA is enabled but code not provided
      return NextResponse.json({
        requiresMFA: true,
        message: 'Please enter your two-factor authentication code',
      });
    }

    if (mfaData && mfaCode) {
      // Verify MFA code
      const { verifyTOTPToken } = await import('@/lib/auth/mfa');
      const isValid = verifyTOTPToken(mfaCode, mfaData.secret_key);

      if (!isValid) {
        // Check backup codes
        const { verifyBackupCode, hashToken } = await import('@/lib/auth/tokens');
        const hashedCode = hashToken(mfaCode);
        const isBackupCode = (mfaData.backup_codes || []).includes(hashedCode);

        if (!isBackupCode || (mfaData.backup_codes_used || []).includes(hashedCode)) {
          await logSecurityEvent(supabase, {
            userId: data.user.id,
            eventType: 'mfa_failed',
            ipAddress,
            metadata: { email },
            success: false,
          });

          return NextResponse.json(
            { error: 'Invalid authentication code' },
            { status: 401 }
          );
        }

        // Mark backup code as used
        await supabase
          .from('user_mfa')
          .update({
            backup_codes_used: [...(mfaData.backup_codes_used || []), hashedCode],
          })
          .eq('id', mfaData.id);
      }

      // Log MFA success
      await logSecurityEvent(supabase, {
        userId: data.user.id,
        eventType: 'mfa_verified',
        ipAddress,
        metadata: { email },
        success: true,
      });
    }

    // Register or update device
    const { data: existingDevice } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', data.user.id)
      .eq('device_fingerprint', deviceInfo.fingerprint)
      .single();

    let deviceId: string;

    if (existingDevice) {
      // Update existing device
      await supabase
        .from('user_devices')
        .update({
          last_used_at: new Date().toISOString(),
          ip_address: ipAddress,
        })
        .eq('id', existingDevice.id);
      
      deviceId = existingDevice.id;
    } else {
      // Create new device
      const { data: newDevice } = await supabase
        .from('user_devices')
        .insert({
          user_id: data.user.id,
          device_fingerprint: deviceInfo.fingerprint,
          device_name: deviceInfo.name,
          device_type: deviceInfo.type,
          browser_name: deviceInfo.browser.name,
          browser_version: deviceInfo.browser.version,
          os_name: deviceInfo.os.name,
          os_version: deviceInfo.os.version,
          ip_address: ipAddress,
        })
        .select()
        .single();

      deviceId = newDevice?.id || '';

      // Log new device
      await logSecurityEvent(supabase, {
        userId: data.user.id,
        eventType: 'device_added',
        ipAddress,
        deviceId,
        metadata: { device: deviceInfo.name },
        success: true,
      });
    }

    // Create session record
    const session = createSession(
      data.user.id,
      ipAddress,
      userAgent,
      deviceId,
      { rememberMe }
    );

    const { data: sessionRecord } = await supabase
      .from('user_sessions')
      .insert({
        user_id: session.userId,
        device_id: session.deviceId,
        session_token: session.sessionToken,
        refresh_token: session.refreshToken,
        ip_address: session.ipAddress,
        user_agent: session.userAgent,
        expires_at: session.expiresAt.toISOString(),
      })
      .select()
      .single();

    // Log successful login
    await logSecurityEvent(supabase, {
      userId: data.user.id,
      eventType: 'login',
      ipAddress,
      deviceId,
      sessionId: sessionRecord?.id,
      metadata: {
        email,
        device: deviceInfo.name,
        rememberMe,
      },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        emailConfirmed: data.user.email_confirmed_at !== null,
      },
      session: {
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
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
        deviceId: event.deviceId,
        sessionId: event.sessionId,
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
      device_id: securityEvent.deviceId,
      session_id: securityEvent.sessionId,
      metadata: securityEvent.metadata,
      success: securityEvent.success,
      error_message: securityEvent.errorMessage,
    });
  } catch (error) {
    console.error('Error logging security event:', error);
  }
}

