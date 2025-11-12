'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Shield, Monitor, Smartphone, Tablet, Globe, Clock, LogOut, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Session {
  id: string;
  user_id: string;
  session_token: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  browser: string;
  os: string;
  dashboard_type: string;
  login_at: string;
  logout_at: string | null;
  last_activity_at: string;
  is_active: boolean;
  logout_reason: string | null;
  user: {
    email: string;
    full_name: string;
    role: string;
  };
}

export default function AdminSessionsPage() {
  const supabase = createClientComponentClient();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [dashboardFilter, setDashboardFilter] = useState<string>('all');

  useEffect(() => {
    fetchSessions();
  }, [filter, dashboardFilter]);

  async function fetchSessions() {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (filter === 'active') params.append('is_active', 'true');
      if (filter === 'inactive') params.append('is_active', 'false');
      if (dashboardFilter !== 'all') params.append('dashboard_type', dashboardFilter);
      
      const response = await fetch(`/api/super-admin/sessions?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleForceLogout(sessionId: string) {
    if (!confirm('Are you sure you want to force logout this session?')) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/sessions/${sessionId}/force-logout`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Session logged out successfully');
        fetchSessions();
      } else {
        alert('Failed to logout session');
      }
    } catch (error) {
      console.error('Error forcing logout:', error);
      alert('Error forcing logout');
    }
  }

  function getDeviceIcon(deviceType: string) {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'tablet': return <Tablet className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  }

  function getDashboardBadge(dashboardType: string) {
    const colors: Record<string, string> = {
      'super-admin': 'bg-red-100 text-red-800',
      'admin': 'bg-blue-100 text-blue-800',
      'content-manager': 'bg-green-100 text-green-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[dashboardType] || 'bg-gray-100 text-gray-800'}`}>
        {dashboardType}
      </span>
    );
  }

  function formatDuration(loginAt: string, logoutAt: string | null) {
    const start = new Date(loginAt);
    const end = logoutAt ? new Date(logoutAt) : new Date();
    const diff = end.getTime() - start.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  const activeSessions = sessions.filter(s => s.is_active);
  const totalSessions = sessions.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shield className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
        </div>
        <p className="text-gray-600">Monitor and manage all admin login sessions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Sessions</span>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalSessions}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Active Now</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{activeSessions.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Inactive</span>
            <XCircle className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-600">{totalSessions - activeSessions.length}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Unique Users</span>
            <Monitor className="w-5 h-5 text-primary-600" />
          </div>
          <p className="text-3xl font-bold text-primary-600">
            {new Set(sessions.map(s => s.user_id)).size}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Sessions
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active Only
              </button>
              <button
                onClick={() => setFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'inactive'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inactive Only
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dashboard Type
            </label>
            <select
              value={dashboardFilter}
              onChange={(e) => setDashboardFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Dashboards</option>
              <option value="super-admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="content-manager">Content Manager</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No sessions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Dashboard</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Device</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">IP Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Login Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{session.user?.full_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">{session.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getDashboardBadge(session.dashboard_type)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(session.device_type)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{session.browser}</p>
                          <p className="text-xs text-gray-600">{session.os}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{session.ip_address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(session.login_at).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {formatDuration(session.login_at, session.logout_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {session.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          {session.logout_reason || 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {session.is_active && (
                        <button
                          onClick={() => handleForceLogout(session.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1"
                        >
                          <LogOut className="w-4 h-4" />
                          Force Logout
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

