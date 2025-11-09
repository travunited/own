/**
 * Session Management
 * Session creation, validation, and revocation
 */

import { generateSessionToken } from './tokens';

export interface Session {
  id: string;
  userId: string;
  deviceId?: string;
  sessionToken: string;
  refreshToken?: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  lastActivityAt: Date;
  expiresAt: Date;
  createdAt: Date;
}

export interface SessionOptions {
  accessTokenExpiry?: number; // minutes
  refreshTokenExpiry?: number; // days
  rememberMe?: boolean;
}

/**
 * Default session configuration
 */
const DEFAULT_ACCESS_TOKEN_EXPIRY = 15; // 15 minutes
const DEFAULT_REFRESH_TOKEN_EXPIRY = 7; // 7 days
const REMEMBER_ME_EXPIRY = 30; // 30 days

/**
 * Create new session
 */
export function createSession(
  userId: string,
  ipAddress: string,
  userAgent: string,
  deviceId?: string,
  options: SessionOptions = {}
): Omit<Session, 'id' | 'createdAt'> {
  const now = new Date();
  
  const accessTokenExpiry = options.rememberMe
    ? REMEMBER_ME_EXPIRY * 24 * 60 // Convert days to minutes
    : options.accessTokenExpiry || DEFAULT_ACCESS_TOKEN_EXPIRY;
  
  const expiresAt = new Date(now.getTime() + accessTokenExpiry * 60 * 1000);
  
  return {
    userId,
    deviceId,
    sessionToken: generateSessionToken(),
    refreshToken: generateSessionToken(),
    ipAddress,
    userAgent,
    isActive: true,
    lastActivityAt: now,
    expiresAt,
  };
}

/**
 * Check if session is valid
 */
export function isSessionValid(session: Session): boolean {
  if (!session.isActive) return false;
  if (session.expiresAt && new Date() > new Date(session.expiresAt)) return false;
  return true;
}

/**
 * Check if session needs refresh
 */
export function shouldRefreshSession(session: Session): boolean {
  if (!isSessionValid(session)) return false;
  
  // Refresh if less than 5 minutes remaining
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const minutesRemaining = (expiresAt.getTime() - now.getTime()) / (60 * 1000);
  
  return minutesRemaining < 5;
}

/**
 * Get session expiration time
 */
export function getSessionExpiration(
  options: SessionOptions = {}
): Date {
  const now = new Date();
  
  if (options.rememberMe) {
    return new Date(now.getTime() + REMEMBER_ME_EXPIRY * 24 * 60 * 60 * 1000);
  }
  
  const expiry = options.accessTokenExpiry || DEFAULT_ACCESS_TOKEN_EXPIRY;
  return new Date(now.getTime() + expiry * 60 * 1000);
}

/**
 * Calculate session idle time
 */
export function getSessionIdleTime(session: Session): number {
  const now = new Date();
  const lastActivity = new Date(session.lastActivityAt);
  return Math.floor((now.getTime() - lastActivity.getTime()) / (60 * 1000)); // minutes
}

/**
 * Check if session is idle
 */
export function isSessionIdle(session: Session, maxIdleMinutes: number = 30): boolean {
  return getSessionIdleTime(session) > maxIdleMinutes;
}

/**
 * Format session duration
 */
export function formatSessionDuration(session: Session): string {
  const now = new Date();
  const created = new Date(session.createdAt);
  const durationMs = now.getTime() - created.getTime();
  
  const hours = Math.floor(durationMs / (60 * 60 * 1000));
  const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Format session expiry
 */
export function formatSessionExpiry(session: Session): string {
  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const diffMs = expiresAt.getTime() - now.getTime();
  
  if (diffMs < 0) return 'Expired';
  
  const minutes = Math.floor(diffMs / (60 * 1000));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Get session status
 */
export function getSessionStatus(session: Session): 'active' | 'expired' | 'revoked' | 'idle' {
  if (!session.isActive) return 'revoked';
  if (new Date() > new Date(session.expiresAt)) return 'expired';
  if (isSessionIdle(session)) return 'idle';
  return 'active';
}

/**
 * Sanitize session data for client
 */
export function sanitizeSession(session: Session): Partial<Session> {
  return {
    id: session.id,
    deviceId: session.deviceId,
    ipAddress: session.ipAddress,
    isActive: session.isActive,
    lastActivityAt: session.lastActivityAt,
    expiresAt: session.expiresAt,
    createdAt: session.createdAt,
    // Don't send tokens to client
  };
}

