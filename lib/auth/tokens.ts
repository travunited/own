/**
 * Token Utilities
 * Generate and verify secure tokens for various auth purposes
 */

import { randomBytes, createHash } from 'crypto';

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Generate password reset token
 */
export function generatePasswordResetToken(): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const token = generateSecureToken(32);
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  return {
    token,
    hashedToken,
    expiresAt,
  };
}

/**
 * Generate email verification token
 */
export function generateEmailVerificationToken(): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const token = generateSecureToken(32);
  const hashedToken = hashToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  return {
    token,
    hashedToken,
    expiresAt,
  };
}

/**
 * Hash a token for storage
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/**
 * Verify token against hash
 */
export function verifyToken(token: string, hashedToken: string): boolean {
  const hash = hashToken(token);
  return hash === hashedToken;
}

/**
 * Generate session token
 */
export function generateSessionToken(): string {
  return generateSecureToken(48);
}

/**
 * Generate API key
 */
export function generateApiKey(): string {
  return `sk_${generateSecureToken(32)}`;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}

/**
 * Generate short numeric code (for SMS/email verification)
 */
export function generateNumericCode(length: number = 6): string {
  const digits = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    code += digits[randomIndex];
  }
  
  return code;
}

/**
 * Generate backup codes for MFA
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate 8-digit codes in format: XXXX-XXXX
    const part1 = generateNumericCode(4);
    const part2 = generateNumericCode(4);
    codes.push(`${part1}-${part2}`);
  }
  
  return codes;
}

/**
 * Hash backup codes for storage
 */
export function hashBackupCodes(codes: string[]): string[] {
  return codes.map(code => hashToken(code));
}

/**
 * Verify backup code
 */
export function verifyBackupCode(
  code: string,
  hashedCodes: string[]
): boolean {
  const hash = hashToken(code);
  return hashedCodes.includes(hash);
}

