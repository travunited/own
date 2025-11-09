/**
 * Multi-Factor Authentication (MFA) Utilities
 * TOTP generation, verification, and QR code creation
 */

import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Configure TOTP
authenticator.options = {
  window: 1, // Allow 1 step before/after for time drift
  step: 30, // 30 second time step
};

export interface MFASetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

/**
 * Generate TOTP secret
 */
export function generateTOTPSecret(): string {
  return authenticator.generateSecret();
}

/**
 * Generate QR code URL for TOTP setup
 */
export async function generateQRCode(
  email: string,
  secret: string,
  issuer: string = 'Travunited'
): Promise<string> {
  const otpauth = authenticator.keyuri(email, issuer, secret);
  
  try {
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    return qrCodeUrl;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Verify TOTP token
 */
export function verifyTOTPToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

/**
 * Generate TOTP token (for testing)
 */
export function generateTOTPToken(secret: string): string {
  return authenticator.generate(secret);
}

/**
 * Get time remaining for current TOTP token
 */
export function getTimeRemaining(): number {
  const now = Math.floor(Date.now() / 1000);
  const step = authenticator.options.step || 30;
  return step - (now % step);
}

/**
 * Format backup code for display
 */
export function formatBackupCode(code: string): string {
  // Format as XXXX-XXXX
  return code.replace(/(\d{4})(\d{4})/, '$1-$2');
}

/**
 * Validate backup code format
 */
export function isValidBackupCodeFormat(code: string): boolean {
  // Should be 8 digits with optional dash
  const cleaned = code.replace('-', '');
  return /^\d{8}$/.test(cleaned);
}

/**
 * Clean backup code (remove dashes, spaces)
 */
export function cleanBackupCode(code: string): string {
  return code.replace(/[-\s]/g, '');
}

/**
 * Check if MFA is required for user
 */
export interface MFAStatus {
  isEnabled: boolean;
  isVerified: boolean;
  lastUsed: Date | null;
  backupCodesRemaining: number;
}

/**
 * Get MFA method name
 */
export function getMFAMethodName(method: string): string {
  const methods: Record<string, string> = {
    totp: 'Authenticator App',
    sms: 'SMS',
    email: 'Email',
  };
  
  return methods[method] || 'Unknown';
}

/**
 * Get authenticator app recommendations
 */
export function getAuthenticatorApps(): Array<{
  name: string;
  ios: string;
  android: string;
}> {
  return [
    {
      name: 'Google Authenticator',
      ios: 'https://apps.apple.com/app/google-authenticator/id388497605',
      android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2',
    },
    {
      name: 'Microsoft Authenticator',
      ios: 'https://apps.apple.com/app/microsoft-authenticator/id983156458',
      android: 'https://play.google.com/store/apps/details?id=com.azure.authenticator',
    },
    {
      name: 'Authy',
      ios: 'https://apps.apple.com/app/authy/id494168017',
      android: 'https://play.google.com/store/apps/details?id=com.authy.authy',
    },
  ];
}

