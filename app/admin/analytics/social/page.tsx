'use client';

import { useState, useEffect } from 'react';
import { Share2, Users, TrendingUp, DollarSign, BarChart3, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function SocialAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  // Mock data - will be replaced with real API
  const stats = {
    totalShares: 4523,
    totalReferrals: 892,
    totalRevenue: 4456000,
    conversionRate: 12.4,
  };

  const sharesByPlatform = [
    { platform: 'WhatsApp', shares: 1823, percentage: 40 },
    { platform: 'Facebook', shares: 1130, percentage: 25 },
    { platform: 'Twitter', shares: 678, percentage: 15 },
    { platform: 'Copy Link', shares: 542, percentage: 12 },
    { platform: 'Email', shares: 350, percentage: 8 },
  ];

  const sharesTrend = [
    { date: 'Week 1', shares: 234, referrals: 28 },
    { date: 'Week 2', shares: 456, referrals: 52 },
    { date: 'Week 3', shares: 678, referrals: 84 },
    { date: 'Week 4', shares: 892, referrals: 112 },
  ];

  const topContent = [
    {
      type: 'Visa',
      title: 'Dubai Tourist Visa',
      shares: 856,
      referrals: 145,
      revenue: 724550,
    },
    {
      type: 'Tour',
      title: 'Magical Dubai Tour',
      shares: 723,
      referrals: 89,
      revenue: 2224775,
    },
    {
      type: 'Blog',
      title: 'Complete Dubai Visa Guide',
      shares: 612,
      referrals: 78,
      revenue: 0,
    },
    {
      type: 'Visa',
      title: 'Singapore Visa',
      shares: 534,
      referrals: 67,
      revenue: 267330,
    },
  ];

  const topReferrers = [
    {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      referrals: 23,
      earned: 17250,
      tier: 3,
    },
    {
      name: 'Rahul Kumar',
      email: 'rahul@example.com',
      referrals: 18,
      earned: 13500,
      tier: 3,
    },
    {
      name: 'Anita Patel',
      email: 'anita@example.com',
      referrals: 14,
      earned: 10500,
      tier: 2,
    },
  ];

  const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];

  useEffect(() => {
    // Load analytics data
    setTimeout(() => setLoading(false), 1000);
  }, [dateRange]);

  const exportData = () => {
    alert('Export feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Social Sharing Analytics</h1>
            <p className="text-gray-600 mt-2">
              Track shares, referrals, and revenue from social media
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="input-field"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            <button onClick={exportData} className="btn-outline flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Shares</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalShares.toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">↑ 24% from last month</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Referrals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReferrals}</p>
                <p className="text-sm text-green-600 mt-1">↑ 18% from last month</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenue from Referrals</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{(stats.totalRevenue / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-green-600 mt-1">↑ 32% from last month</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.conversionRate}%</p>
                <p className="text-sm text-green-600 mt-1">↑ 2.3% from last month</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Shares Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shares & Referrals Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sharesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="shares" stroke="#2563eb" strokeWidth={2} name="Shares" />
                <Line type="monotone" dataKey="referrals" stroke="#10b981" strokeWidth={2} name="Referrals" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Shares by Platform */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Shares by Platform</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sharesByPlatform}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.platform}: ${entry.percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="shares"
                >
                  {sharesByPlatform.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Shared Content</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topContent.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{item.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {item.shares}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {item.referrals}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">
                      ₹{(item.revenue / 1000).toFixed(0)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Referrers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Referrers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Referrals
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Earned
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Tier
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topReferrers.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">
                      {user.referrals}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">
                      ₹{user.earned.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.tier === 3
                            ? 'bg-purple-100 text-purple-800'
                            : user.tier === 2
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        Level {user.tier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

