'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  CreditCard,
  Globe,
  TrendingUp,
  Settings,
  Shield,
  Activity,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    successRate: 0,
    totalPayments: 0,
    pendingPayments: 0,
    countries: 0,
    visaTypes: 0,
  });

  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [applicationChart, setApplicationChart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API call
      setStats({
        totalUsers: 1250,
        activeUsers: 892,
        totalApplications: 3420,
        pendingApplications: 145,
        approvedApplications: 2890,
        rejectedApplications: 385,
        totalRevenue: 25000000,
        monthlyRevenue: 3200000,
        successRate: 84.5,
        totalPayments: 3200,
        pendingPayments: 28,
        countries: 45,
        visaTypes: 180,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const quickStats = [
    {
      name: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      link: '/super-admin/users',
    },
    {
      name: 'Active Applications',
      value: stats.pendingApplications,
      change: '+5.2%',
      trend: 'up',
      icon: FileText,
      color: 'purple',
      link: '/super-admin/applications',
    },
    {
      name: 'Monthly Revenue',
      value: formatCurrency(stats.monthlyRevenue),
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      link: '/super-admin/payments',
    },
    {
      name: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange',
      link: '/super-admin/analytics',
    },
  ];

  const managementSections = [
    {
      title: 'User Management',
      description: 'Manage users, assign roles, view activity',
      icon: Users,
      color: 'blue',
      link: '/super-admin/users',
      stats: [
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Active', value: stats.activeUsers },
      ],
    },
    {
      title: 'Application Management',
      description: 'View, filter, and manage all applications',
      icon: FileText,
      color: 'purple',
      link: '/super-admin/applications',
      stats: [
        { label: 'Total', value: stats.totalApplications },
        { label: 'Pending', value: stats.pendingApplications },
      ],
    },
    {
      title: 'Payment Management',
      description: 'View payments, process refunds, analytics',
      icon: CreditCard,
      color: 'green',
      link: '/super-admin/payments',
      stats: [
        { label: 'Total Payments', value: stats.totalPayments },
        { label: 'Pending', value: stats.pendingPayments },
      ],
    },
    {
      title: 'Country & Visa Management',
      description: 'Manage countries, visa types, pricing',
      icon: Globe,
      color: 'indigo',
      link: '/super-admin/countries',
      stats: [
        { label: 'Countries', value: stats.countries },
        { label: 'Visa Types', value: stats.visaTypes },
      ],
    },
    {
      title: 'Analytics Dashboard',
      description: 'Revenue, conversion, performance metrics',
      icon: BarChart3,
      color: 'orange',
      link: '/super-admin/analytics',
      stats: [
        { label: 'Success Rate', value: `${stats.successRate}%` },
        { label: 'Revenue', value: formatCurrency(stats.monthlyRevenue) },
      ],
    },
    {
      title: 'System Configuration',
      description: 'Settings, integrations, security',
      icon: Settings,
      color: 'gray',
      link: '/super-admin/settings',
      stats: [
        { label: 'Email', value: 'Active' },
        { label: 'Payment', value: 'Active' },
      ],
    },
  ];

  const recentActivity = [
    {
      type: 'user',
      action: 'New user registered',
      details: 'john.doe@example.com',
      time: '2 minutes ago',
      icon: Users,
      color: 'blue',
    },
    {
      type: 'application',
      action: 'Application approved',
      details: 'TVU-20250109-00123',
      time: '5 minutes ago',
      icon: CheckCircle,
      color: 'green',
    },
    {
      type: 'payment',
      action: 'Payment received',
      details: '₹15,000',
      time: '12 minutes ago',
      icon: DollarSign,
      color: 'green',
    },
    {
      type: 'alert',
      action: 'Failed payment',
      details: 'TVU-20250109-00124',
      time: '18 minutes ago',
      icon: AlertCircle,
      color: 'red',
    },
  ];

  const applicationBreakdown = [
    { status: 'Pending', count: stats.pendingApplications, color: 'yellow' },
    { status: 'Approved', count: stats.approvedApplications, color: 'green' },
    { status: 'Rejected', count: stats.rejectedApplications, color: 'red' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading super admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Shield className="w-8 h-8 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Super Admin</h1>
          </div>
          <p className="text-gray-600 text-lg">Complete system control & analytics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            const isUp = stat.trend === 'up';

            return (
              <Link
                key={index}
                href={stat.link}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-${stat.color}-100`}
                  >
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div
                    className={`flex items-center text-sm font-semibold ${
                      isUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </Link>
            );
          })}
        </div>

        {/* Application Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Application Status Overview</h2>
          <div className="grid grid-cols-3 gap-6">
            {applicationBreakdown.map((item) => (
              <div
                key={item.status}
                className={`p-6 rounded-xl bg-${item.color}-50 border-2 border-${item.color}-200`}
              >
                <p className={`text-sm font-medium text-${item.color}-700 mb-2`}>
                  {item.status}
                </p>
                <p className={`text-4xl font-bold text-${item.color}-700`}>
                  {item.count.toLocaleString()}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {((item.count / stats.totalApplications) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Management Sections */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {managementSections.map((section) => {
                const Icon = section.icon;

                return (
                  <Link
                    key={section.title}
                    href={section.link}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg bg-${section.color}-100 group-hover:bg-${section.color}-200 transition-colors`}
                      >
                        <Icon className={`w-6 h-6 text-${section.color}-600`} />
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      {section.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-xs text-gray-600">{stat.label}</p>
                          <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div
                        className={`p-2 rounded-lg bg-${activity.color}-100 flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 text-${activity.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {activity.details}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <Link
                href="/super-admin/activity"
                className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-4 pt-4 border-t border-gray-100"
              >
                View All Activity →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl shadow-lg p-6 mt-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/super-admin/users/create"
                  className="block bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 transition-colors"
                >
                  <p className="font-medium">Create Admin User</p>
                  <p className="text-xs text-white/80">Assign roles & permissions</p>
                </Link>
                <Link
                  href="/super-admin/countries/create"
                  className="block bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 transition-colors"
                >
                  <p className="font-medium">Add Country/Visa</p>
                  <p className="text-xs text-white/80">Configure visa types</p>
                </Link>
                <Link
                  href="/super-admin/settings"
                  className="block bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 transition-colors"
                >
                  <p className="font-medium">System Settings</p>
                  <p className="text-xs text-white/80">Configure integrations</p>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Database</p>
              <p className="text-xs text-green-600">Healthy</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Payment Gateway</p>
              <p className="text-xs text-green-600">Connected</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Email Service</p>
              <p className="text-xs text-green-600">Active</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Storage</p>
              <p className="text-xs text-green-600">85% Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

