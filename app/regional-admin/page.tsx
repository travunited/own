'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Activity,
} from 'lucide-react';

export default function RegionalAdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('india');
  const [stats, setStats] = useState({
    totalApplications: 0,
    processingTime: 0,
    successRate: 0,
    revenue: 0,
    activeUsers: 0,
    growthRate: 0,
  });

  const assignedRegions = [
    { id: 'india', name: 'India', flag: '🇮🇳' },
    { id: 'southeast-asia', name: 'Southeast Asia', flag: '🌏' },
  ];

  useEffect(() => {
    loadRegionalData();
  }, [selectedRegion]);

  const loadRegionalData = async () => {
    try {
      // TODO: Replace with actual API call filtered by region
      setStats({
        totalApplications: 245,
        processingTime: 3.5,
        successRate: 87.5,
        revenue: 1850000,
        activeUsers: 428,
        growthRate: 15.3,
      });
    } catch (error) {
      console.error('Error loading regional data:', error);
    } finally {
      setLoading(false);
    }
  };

  const regionalStats = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      change: `+${stats.growthRate}%`,
      icon: FileText,
      color: 'blue',
      trend: 'up',
    },
    {
      title: 'Avg Processing Time',
      value: `${stats.processingTime} days`,
      change: '-0.5 days',
      icon: Clock,
      color: 'purple',
      trend: 'up',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+2.1%',
      icon: CheckCircle,
      color: 'green',
      trend: 'up',
    },
    {
      title: 'Regional Revenue',
      value: `₹${(stats.revenue / 100000).toFixed(1)}L`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'orange',
      trend: 'up',
    },
  ];

  const recentApplications = [
    {
      id: '1',
      number: 'TVU-20250109-00123',
      user: 'Rajesh Kumar',
      destination: 'Thailand',
      status: 'under_review',
      submittedAt: '2 hours ago',
    },
    {
      id: '2',
      number: 'TVU-20250109-00124',
      user: 'Priya Sharma',
      destination: 'Singapore',
      status: 'approved',
      submittedAt: '4 hours ago',
    },
    {
      id: '3',
      number: 'TVU-20250109-00125',
      user: 'Amit Patel',
      destination: 'Malaysia',
      status: 'documents_pending',
      submittedAt: '6 hours ago',
    },
  ];

  const performanceMetrics = [
    { label: 'Approval Rate', value: '87.5%', trend: '+2.1%', color: 'green' },
    { label: 'Rejection Rate', value: '8.2%', trend: '-1.5%', color: 'red' },
    { label: 'Pending Rate', value: '4.3%', trend: '-0.6%', color: 'yellow' },
  ];

  const topDestinations = [
    { country: 'Thailand', flag: '🇹🇭', applications: 85, percentage: 34.7 },
    { country: 'Singapore', flag: '🇸🇬', applications: 62, percentage: 25.3 },
    { country: 'Malaysia', flag: '🇲🇾', applications: 48, percentage: 19.6 },
    { country: 'Dubai', flag: '🇦🇪', applications: 35, percentage: 14.3 },
    { country: 'Others', flag: '🌍', applications: 15, percentage: 6.1 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading regional dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-8 h-8 text-indigo-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">Regional Admin</h1>
              </div>
              <p className="text-gray-600">
                Regional operations & performance analytics
              </p>
            </div>

            {/* Region Selector */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Selected Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {assignedRegions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.flag} {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {regionalStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Performance Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Performance Metrics
                </h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  View Details →
                </button>
              </div>

              <div className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.label} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {metric.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {metric.value}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            metric.trend.startsWith('+')
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-${metric.color}-500 h-2 rounded-full transition-all`}
                        style={{ width: metric.value }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Applications
                </h2>
                <button
                  onClick={() => router.push('/regional-admin/applications')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/regional-admin/applications/${app.id}`)
                    }
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{app.number}</p>
                      <p className="text-sm text-gray-600">
                        {app.user} → {app.destination}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : app.status === 'under_review'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {app.submittedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Destinations */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Top Destinations
              </h2>

              <div className="space-y-4">
                {topDestinations.map((dest, index) => (
                  <div key={dest.country}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{dest.flag}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {dest.country}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {dest.applications}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${dest.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/regional-admin/reports')}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors"
                >
                  <Download className="w-5 h-5 mb-1" />
                  <p className="font-medium">Generate Report</p>
                  <p className="text-xs text-white/80">Regional analytics</p>
                </button>
                <button
                  onClick={() => router.push('/regional-admin/users')}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors"
                >
                  <Users className="w-5 h-5 mb-1" />
                  <p className="font-medium">Manage Users</p>
                  <p className="text-xs text-white/80">Regional users</p>
                </button>
                <button
                  onClick={() => router.push('/regional-admin/analytics')}
                  className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors"
                >
                  <BarChart3 className="w-5 h-5 mb-1" />
                  <p className="font-medium">View Analytics</p>
                  <p className="text-xs text-white/80">Detailed insights</p>
                </button>
              </div>
            </div>

            {/* Regional Growth */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                User Growth
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  +{stats.growthRate}%
                </div>
                <p className="text-sm text-gray-600 mb-4">This Month</p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {stats.activeUsers}
                    </p>
                    <p className="text-gray-600">Active Users</p>
                  </div>
                  <div className="w-px h-10 bg-gray-300"></div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {stats.totalApplications}
                    </p>
                    <p className="text-gray-600">Applications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

