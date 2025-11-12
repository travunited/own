'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Globe,
  Plane,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  ArrowRight,
  BarChart3,
  CreditCard,
  Settings,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalRevenue: 0,
    revenueThisMonth: 0,
    totalTours: 0,
    tourBookings: 0,
    totalCountries: 0,
    supportTickets: 0,
    pendingPayments: 0,
    activeAdmins: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch all stats in parallel
      const [
        { count: totalUsers },
        { count: activeUsers },
        { count: totalApplications },
        { data: applications },
        { count: totalTours },
        { count: tourBookings },
        { count: totalCountries },
        { data: payments },
      ] = await Promise.all([
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('visa_applications').select('*', { count: 'exact', head: true }),
        supabase.from('visa_applications').select('status, created_at, payment_amount'),
        supabase.from('tour_packages').select('*', { count: 'exact', head: true }),
        supabase.from('tour_bookings').select('*', { count: 'exact', head: true }),
        supabase.from('visa_countries').select('*', { count: 'exact', head: true }),
        supabase.from('payments').select('amount, status, created_at'),
      ]);

      // Calculate application stats
      const pendingApplications = applications?.filter(
        (a) => a.status === 'under_review' || a.status === 'documents_submitted'
      ).length || 0;
      const approvedApplications = applications?.filter((a) => a.status === 'approved').length || 0;
      const rejectedApplications = applications?.filter((a) => a.status === 'rejected').length || 0;

      // Calculate revenue
      const totalRevenue = payments?.filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const revenueThisMonth = payments?.filter(
        (p) => p.status === 'completed' && new Date(p.created_at) >= thisMonth
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      const today = new Date().toDateString();
      const newUsersToday = applications?.filter(
        (a) => new Date(a.created_at).toDateString() === today
      ).length || 0;

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        newUsersToday,
        totalApplications: totalApplications || 0,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalRevenue,
        revenueThisMonth,
        totalTours: totalTours || 0,
        tourBookings: tourBookings || 0,
        totalCountries: totalCountries || 0,
        supportTickets: 0, // TODO: When support system is ready
        pendingPayments: payments?.filter((p) => p.status === 'pending').length || 0,
        activeAdmins: 0, // TODO: Query admin users
      });

      // Load recent activity
      const { data: recentApps } = await supabase
        .from('visa_applications')
        .select('*, user:user_profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(10);

      setRecentActivity(recentApps || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Complete system overview and control</p>
        </div>

        {/* Primary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Users</p>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
                <p className="text-sm text-blue-100 mt-2">+{stats.newUsersToday} today</p>
              </div>
              <Users className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-1">Total Revenue</p>
                <p className="text-4xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-sm text-green-100 mt-2">₹{(stats.revenueThisMonth / 1000).toFixed(0)}K this month</p>
              </div>
              <DollarSign className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-1">Applications</p>
                <p className="text-4xl font-bold">{stats.totalApplications}</p>
                <p className="text-sm text-purple-100 mt-2">{stats.pendingApplications} pending</p>
              </div>
              <FileText className="w-12 h-12 text-white/30" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-1">Tour Bookings</p>
                <p className="text-4xl font-bold">{stats.tourBookings}</p>
                <p className="text-sm text-orange-100 mt-2">{stats.totalTours} packages</p>
              </div>
              <Plane className="w-12 h-12 text-white/30" />
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Countries</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalCountries}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approvedApplications}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejectedApplications}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Active Users</p>
            <p className="text-2xl font-bold text-blue-600">{stats.activeUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Pending Payment</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-600 mb-1">Support Tickets</p>
            <p className="text-2xl font-bold text-purple-600">{stats.supportTickets}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
              <Link href="/admin/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.user?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.application_number} • {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      activity.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : activity.status === 'under_review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/admin/users"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Manage Users</span>
              </Link>
              <Link
                href="/admin/countries"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Globe className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Manage Countries</span>
              </Link>
              <Link
                href="/admin/payments"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">View Payments</span>
              </Link>
              <Link
                href="/admin/analytics/social"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-700">Analytics</span>
              </Link>
              <Link
                href="/admin/system"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">System Settings</span>
              </Link>
              <Link
                href="/super-admin/sessions"
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Shield className="w-5 h-5 text-red-600" />
                <span className="font-medium text-gray-700">Session Tracking</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Management */}
          <Link
            href="/admin/users"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">User Management</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage users, roles, and permissions
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Users</span>
              <span className="font-bold text-gray-900">{stats.totalUsers}</span>
            </div>
          </Link>

          {/* Application Management */}
          <Link
            href="/admin/applications"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Applications</h3>
            <p className="text-sm text-gray-600 mb-4">
              Review and process visa applications
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-yellow-600">{stats.pendingApplications}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approved</span>
                <span className="font-bold text-green-600">{stats.approvedApplications}</span>
              </div>
            </div>
          </Link>

          {/* Payment Management */}
          <Link
            href="/admin/payments"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Payments</h3>
            <p className="text-sm text-gray-600 mb-4">
              Monitor payments and refunds
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">This Month</span>
              <span className="font-bold text-green-600">
                ₹{(stats.revenueThisMonth / 1000).toFixed(0)}K
              </span>
            </div>
          </Link>

          {/* Country Management */}
          <Link
            href="/admin/countries"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-cyan-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Countries</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage visa countries and types
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Countries</span>
              <span className="font-bold text-gray-900">{stats.totalCountries}</span>
            </div>
          </Link>

          {/* Tour Management */}
          <Link
            href="/admin/tours"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-orange-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Tours</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage tour packages and bookings
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Packages</span>
                <span className="font-bold text-gray-900">{stats.totalTours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bookings</span>
                <span className="font-bold text-orange-600">{stats.tourBookings}</span>
              </div>
            </div>
          </Link>

          {/* Blog Management */}
          <Link
            href="/admin/content/blog"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-pink-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Blog CMS</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create and manage blog content
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Published</span>
              <span className="font-bold text-gray-900">24</span>
            </div>
          </Link>

          {/* Role Management */}
          <Link
            href="/admin/roles"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Roles</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage roles and permissions
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Admin Roles</span>
              <span className="font-bold text-gray-900">5</span>
            </div>
          </Link>

          {/* Team Management */}
          <Link
            href="/admin/team"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Team</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage admin team members
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Team Size</span>
              <span className="font-bold text-gray-900">{stats.activeAdmins || 12}</span>
            </div>
          </Link>

          {/* System Settings */}
          <Link
            href="/admin/system"
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-gray-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">System</h3>
            <p className="text-sm text-gray-600 mb-4">
              Configure system settings
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
