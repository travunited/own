'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import MFASetupWizard from '@/components/auth/MFASetupWizard';
import {
  Shield,
  Key,
  Smartphone,
  Monitor,
  Clock,
  AlertCircle,
  CheckCircle,
  Lock,
  Trash2,
  RefreshCw,
} from 'lucide-react';

export default function SecuritySettingsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMFAWizard, setShowMFAWizard] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      // Fetch devices
      const devicesRes = await fetch('/api/auth/devices');
      if (devicesRes.ok) {
        const devicesData = await devicesRes.json();
        setDevices(devicesData.devices || []);
      }

      // Fetch sessions
      const sessionsRes = await fetch('/api/auth/sessions');
      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.sessions || []);
      }

      // TODO: Fetch MFA status
      setMfaEnabled(false);
    } catch (error) {
      console.error('Error fetching security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Are you sure you want to remove this device?')) return;

    try {
      const response = await fetch(`/api/auth/devices/${deviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDevices(devices.filter(d => d.id !== deviceId));
      }
    } catch (error) {
      console.error('Error removing device:', error);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to revoke this session?')) return;

    try {
      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Error revoking session:', error);
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!confirm('This will sign you out of all other devices. Continue?')) return;

    try {
      const response = await fetch('/api/auth/sessions', {
        method: 'DELETE',
        body: JSON.stringify({ revokeAll: true }),
      });

      if (response.ok) {
        fetchSecurityData();
      }
    } catch (error) {
      console.error('Error revoking sessions:', error);
    }
  };

  if (showMFAWizard) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <MFASetupWizard
            onComplete={() => {
              setShowMFAWizard(false);
              setMfaEnabled(true);
            }}
            onCancel={() => setShowMFAWizard(false)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account security and authentication</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'mfa', label: 'Two-Factor Auth', icon: Key },
              { id: 'devices', label: 'Devices', icon: Smartphone },
              { id: 'sessions', label: 'Active Sessions', icon: Monitor },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Security Score */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
                  <p className="text-sm text-gray-600">Your account security level</p>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {mfaEnabled ? '90%' : '60%'}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Strong password</span>
                  </div>
                  <span className="text-gray-500">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  {mfaEnabled ? (
                    <>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        <span>Two-factor authentication</span>
                      </div>
                      <span className="text-gray-500">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                        <span>Two-factor authentication</span>
                      </div>
                      <button
                        onClick={() => setShowMFAWizard(true)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Enable
                      </button>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Email verified</span>
                  </div>
                  <span className="text-gray-500">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Devices</p>
                    <p className="text-2xl font-bold text-gray-900">{devices.length}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Monitor className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="text-sm font-semibold text-gray-900">Today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MFA Tab */}
        {activeTab === 'mfa' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add an extra layer of security by requiring a code from your authenticator app.
                  </p>
                  {mfaEnabled ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Two-factor authentication is enabled</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Two-factor authentication is disabled</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => mfaEnabled ? null : setShowMFAWizard(true)}
                  className={mfaEnabled ? 'btn-outline' : 'btn-primary'}
                >
                  {mfaEnabled ? 'Manage' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Devices Tab */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Devices</h3>
              <div className="space-y-4">
                {devices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No devices found</p>
                ) : (
                  devices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{device.device_name}</p>
                          <p className="text-sm text-gray-600">
                            {device.os_name} • {device.browser_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last used: {new Date(device.last_used_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Active Sessions</h3>
                {sessions.length > 1 && (
                  <button
                    onClick={handleRevokeAllSessions}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Revoke All Other Sessions
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No active sessions</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Monitor className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.device?.device_name || 'Unknown Device'}
                          </p>
                          <p className="text-sm text-gray-600">{session.ip_address}</p>
                          <p className="text-xs text-gray-500">
                            Last activity: {new Date(session.last_activity_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Revoke
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

