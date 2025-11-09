/**
 * MFA Setup API Route
 * Initialize MFA setup and generate QR code
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { generateTOTPSecret, generateQRCode } from '@/lib/auth/mfa';
import { generateBackupCodes, hashBackupCodes } from '@/lib/auth/tokens';

export async function POST(request: NextRequest) {
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

    // Generate TOTP secret
    const secret = generateTOTPSecret();

    // Generate QR code
    const qrCodeUrl = await generateQRCode(user.email || '', secret);

    // Generate backup codes
    const backupCodes = generateBackupCodes(10);
    const hashedBackupCodes = hashBackupCodes(backupCodes);

    // Check if MFA already exists
    const { data: existingMFA } = await supabase
      .from('user_mfa')
      .select('*')
      .eq('user_id', user.id)
      .eq('mfa_type', 'totp')
      .single();

    if (existingMFA) {
      // Update existing MFA
      await supabase
        .from('user_mfa')
        .update({
          secret_key: secret,
          backup_codes: hashedBackupCodes,
          backup_codes_used: [],
          is_verified: false,
          is_enabled: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingMFA.id);
    } else {
      // Create new MFA record
      await supabase
        .from('user_mfa')
        .insert({
          user_id: user.id,
          mfa_type: 'totp',
          secret_key: secret,
          backup_codes: hashedBackupCodes,
          backup_codes_used: [],
          is_verified: false,
          is_enabled: false,
        });
    }

    return NextResponse.json({
      success: true,
      data: {
        secret,
        qrCodeUrl,
        backupCodes, // Send plain codes to user (they should save these)
      },
    });
  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

