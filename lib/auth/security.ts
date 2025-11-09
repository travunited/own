/**
 * Security Event Logging
 * Track and log security-related events
 */

export type EventType =
  | 'login'
  | 'logout'
  | 'login_failed'
  | 'password_change'
  | 'password_reset_request'
  | 'password_reset_complete'
  | 'email_verification'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'mfa_verified'
  | 'mfa_failed'
  | 'device_added'
  | 'device_removed'
  | 'device_trusted'
  | 'session_created'
  | 'session_revoked'
  | 'account_locked'
  | 'account_unlocked'
  | 'suspicious_activity';

export type EventCategory = 'auth' | 'mfa' | 'device' | 'session' | 'security' | 'account';

export type EventSeverity = 'info' | 'warning' | 'critical';

export interface SecurityEvent {
  userId?: string;
  eventType: EventType;
  eventCategory: EventCategory;
  severity: EventSeverity;
  ipAddress?: string;
  deviceId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  success: boolean;
  errorMessage?: string;
  createdAt: Date;
}

/**
 * Get event category from event type
 */
export function getEventCategory(eventType: EventType): EventCategory {
  const categoryMap: Record<string, EventCategory> = {
    login: 'auth',
    logout: 'auth',
    login_failed: 'auth',
    password_change: 'auth',
    password_reset_request: 'auth',
    password_reset_complete: 'auth',
    email_verification: 'auth',
    mfa_enabled: 'mfa',
    mfa_disabled: 'mfa',
    mfa_verified: 'mfa',
    mfa_failed: 'mfa',
    device_added: 'device',
    device_removed: 'device',
    device_trusted: 'device',
    session_created: 'session',
    session_revoked: 'session',
    account_locked: 'account',
    account_unlocked: 'account',
    suspicious_activity: 'security',
  };

  return categoryMap[eventType] || 'security';
}

/**
 * Get event severity from event type
 */
export function getEventSeverity(eventType: EventType, success: boolean): EventSeverity {
  // Critical events
  if (
    eventType === 'suspicious_activity' ||
    eventType === 'account_locked' ||
    (eventType === 'login_failed' && !success)
  ) {
    return 'critical';
  }

  // Warning events
  if (
    eventType === 'mfa_failed' ||
    eventType === 'password_reset_request' ||
    eventType === 'device_added'
  ) {
    return 'warning';
  }

  // Info events (default)
  return 'info';
}

/**
 * Create security event
 */
export function createSecurityEvent(
  userId: string | undefined,
  eventType: EventType,
  options: {
    ipAddress?: string;
    deviceId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
    success?: boolean;
    errorMessage?: string;
  } = {}
): SecurityEvent {
  const success = options.success !== undefined ? options.success : true;
  const category = getEventCategory(eventType);
  const severity = getEventSeverity(eventType, success);

  return {
    userId,
    eventType,
    eventCategory: category,
    severity,
    ipAddress: options.ipAddress,
    deviceId: options.deviceId,
    sessionId: options.sessionId,
    metadata: options.metadata,
    success,
    errorMessage: options.errorMessage,
    createdAt: new Date(),
  };
}

/**
 * Get event display name
 */
export function getEventDisplayName(eventType: EventType): string {
  const displayNames: Record<EventType, string> = {
    login: 'Login',
    logout: 'Logout',
    login_failed: 'Login Failed',
    password_change: 'Password Changed',
    password_reset_request: 'Password Reset Requested',
    password_reset_complete: 'Password Reset Complete',
    email_verification: 'Email Verified',
    mfa_enabled: 'Two-Factor Authentication Enabled',
    mfa_disabled: 'Two-Factor Authentication Disabled',
    mfa_verified: 'Two-Factor Code Verified',
    mfa_failed: 'Two-Factor Verification Failed',
    device_added: 'New Device Added',
    device_removed: 'Device Removed',
    device_trusted: 'Device Trusted',
    session_created: 'Session Created',
    session_revoked: 'Session Revoked',
    account_locked: 'Account Locked',
    account_unlocked: 'Account Unlocked',
    suspicious_activity: 'Suspicious Activity Detected',
  };

  return displayNames[eventType] || eventType;
}

/**
 * Get event icon
 */
export function getEventIcon(eventType: EventType): string {
  const icons: Record<string, string> = {
    login: '🔓',
    logout: '🔒',
    login_failed: '❌',
    password_change: '🔑',
    password_reset_request: '📧',
    password_reset_complete: '✅',
    email_verification: '📧',
    mfa_enabled: '🛡️',
    mfa_disabled: '⚠️',
    mfa_verified: '✅',
    mfa_failed: '❌',
    device_added: '📱',
    device_removed: '🗑️',
    device_trusted: '✅',
    session_created: '🔓',
    session_revoked: '🔒',
    account_locked: '🔐',
    account_unlocked: '🔓',
    suspicious_activity: '⚠️',
  };

  return icons[eventType] || '📝';
}

/**
 * Get severity color class
 */
export function getSeverityColor(severity: EventSeverity): string {
  const colors = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600',
  };

  return colors[severity];
}

/**
 * Format event for display
 */
export function formatSecurityEvent(event: SecurityEvent): string {
  const name = getEventDisplayName(event.eventType);
  const icon = getEventIcon(event.eventType);
  const status = event.success ? 'succeeded' : 'failed';
  
  return `${icon} ${name} ${status}`;
}

/**
 * Check if event is suspicious
 */
export function isSuspiciousEvent(event: SecurityEvent): boolean {
  return (
    event.severity === 'critical' ||
    event.eventType === 'suspicious_activity' ||
    event.eventType === 'account_locked' ||
    (event.eventType === 'login_failed' && !event.success)
  );
}

/**
 * Filter events by criteria
 */
export function filterSecurityEvents(
  events: SecurityEvent[],
  filters: {
    eventType?: EventType;
    category?: EventCategory;
    severity?: EventSeverity;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
  }
): SecurityEvent[] {
  return events.filter(event => {
    if (filters.eventType && event.eventType !== filters.eventType) return false;
    if (filters.category && event.eventCategory !== filters.category) return false;
    if (filters.severity && event.severity !== filters.severity) return false;
    if (filters.success !== undefined && event.success !== filters.success) return false;
    if (filters.startDate && new Date(event.createdAt) < filters.startDate) return false;
    if (filters.endDate && new Date(event.createdAt) > filters.endDate) return false;
    return true;
  });
}

