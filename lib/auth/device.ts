/**
 * Device Fingerprinting & Management
 * Device detection, fingerprinting, and trusted device management
 */

import UAParser from 'ua-parser-js';

export interface DeviceInfo {
  fingerprint: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  isTrusted: boolean;
}

/**
 * Parse user agent string
 */
export function parseUserAgent(userAgent: string): UAParser.IResult {
  const parser = new UAParser(userAgent);
  return parser.getResult();
}

/**
 * Get device info from user agent
 */
export function getDeviceInfo(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Generate fingerprint from user agent components
  const fingerprint = generateDeviceFingerprint(userAgent);

  // Determine device type
  let deviceType: DeviceInfo['type'] = 'unknown';
  if (result.device.type === 'mobile') deviceType = 'mobile';
  else if (result.device.type === 'tablet') deviceType = 'tablet';
  else if (result.device.type === 'desktop' || !result.device.type) deviceType = 'desktop';

  // Generate device name
  const deviceName = generateDeviceName(result);

  return {
    fingerprint,
    name: deviceName,
    type: deviceType,
    browser: {
      name: result.browser.name || 'Unknown',
      version: result.browser.version || 'Unknown',
    },
    os: {
      name: result.os.name || 'Unknown',
      version: result.os.version || 'Unknown',
    },
    isTrusted: false,
  };
}

/**
 * Generate device fingerprint from user agent
 */
export function generateDeviceFingerprint(userAgent: string): string {
  // Create a hash of the user agent
  // In production, you'd want to use FingerprintJS for more robust fingerprinting
  const hash = Buffer.from(userAgent).toString('base64');
  return hash.substring(0, 32);
}

/**
 * Generate human-readable device name
 */
export function generateDeviceName(parsed: UAParser.IResult): string {
  const browser = parsed.browser.name || 'Unknown Browser';
  const os = parsed.os.name || 'Unknown OS';
  const device = parsed.device.type || 'Desktop';

  return `${browser} on ${os} (${device})`;
}

/**
 * Get device icon based on type
 */
export function getDeviceIcon(deviceType: DeviceInfo['type']): string {
  const icons = {
    mobile: '📱',
    tablet: '💻',
    desktop: '🖥️',
    unknown: '❓',
  };
  
  return icons[deviceType];
}

/**
 * Check if device should be trusted by default
 */
export function shouldTrustDevice(deviceInfo: DeviceInfo): boolean {
  // Never trust by default for security
  return false;
}

/**
 * Calculate trust expiration date
 */
export function getTrustExpirationDate(days: number = 30): Date {
  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

/**
 * Check if device trust has expired
 */
export function isDeviceTrustExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
}

/**
 * Get location from IP address (basic implementation)
 */
export interface LocationInfo {
  country: string;
  city: string;
  ip: string;
}

/**
 * Format device last used time
 */
export function formatLastUsed(lastUsed: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(lastUsed).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return new Date(lastUsed).toLocaleDateString();
}

/**
 * Detect suspicious device characteristics
 */
export function isSuspiciousDevice(deviceInfo: DeviceInfo): boolean {
  // Check for headless browsers or automation tools
  const suspiciousBrowsers = ['phantomjs', 'headless', 'selenium'];
  const browserName = deviceInfo.browser.name.toLowerCase();
  
  return suspiciousBrowsers.some(suspicious => 
    browserName.includes(suspicious)
  );
}

/**
 * Compare two device fingerprints
 */
export function areDevicesSame(
  fingerprint1: string,
  fingerprint2: string
): boolean {
  return fingerprint1 === fingerprint2;
}

