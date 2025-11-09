/**
 * MFA Backup Codes API Route
 * Regenerate backup codes
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateBackupCodes, hashBackupCodes } from '@/lib/auth/tokens';
import { createSecurityEvent } from '@/lib/auth/security';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password confirmation required' },
        { status: 400 }
      );
    }

    // Get IP address
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (verifyError) {
      return NextResponse.json(
        { error: 'Invalid password' },
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

    // Generate new backup codes
    const backupCodes = generateBackupCodes(10);
    const hashedBackupCodes = hashBackupCodes(backupCodes);

    // Update backup codes
    await supabase
      .from('user_mfa')
      .update({
        backup_codes: hashedBackupCodes,
        backup_codes_used: [], // Reset used codes
        updated_at: new Date().toISOString(),
      })
      .eq('id', mfaData.id);

    // Log backup codes regeneration
    await logSecurityEvent(supabase, {
      userId: user.id,
      eventType: 'mfa_verified',
      ipAddress,
      metadata: { action: 'backup_codes_regenerated' },
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Backup codes regenerated successfully',
      backupCodes, // Send plain codes to user
    });
  } catch (error) {
    console.error('Backup codes regeneration error:', error);
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

