'use client';

import Link from 'next/link';
import {
  FileText,
  Plane,
  DollarSign,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';

export default function AdminDashboard() {

  const stats = [
    {
      label: 'Today\'s Revenue',
      value: '₹2,45,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending Visa Applications',
      value: '24',
      change: '-5%',
      trend: 'down',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active Tour Bookings',
      value: '18',
      change: '+8%',
      trend: 'up',
      icon: Plane,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Support Tickets',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const recentApplications = [
    {
      id: 'TRV12345',
      customer: 'John Doe',
      destination: 'Dubai',
      type: 'Tourist Visa',
      status: 'UNDER_REVIEW',
      amount: '₹11,000',
      date: '2024-11-08',
    },
    {
      id: 'TRV12344',
      customer: 'Jane Smith',
      destination: 'Singapore',
      type: 'Business Visa',
      status: 'DOCS_PENDING',
      amount: '₹8,000',
      date: '2024-11-08',
    },
    {
      id: 'TRV12343',
      customer: 'Rahul Kumar',
      destination: 'UK',
      type: 'Tourist Visa',
      status: 'APPROVED',
      amount: '₹26,000',
      date: '2024-11-07',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Overview</h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-16 h-16 text-gray-400" />
                <p className="ml-4 text-gray-600">Chart Placeholder</p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Application Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="text-gray-700">Pending Review</span>
                  </div>
                  <span className="font-bold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-700">Under Process</span>
                  </div>
                  <span className="font-bold text-gray-900">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Approved Today</span>
                  </div>
                  <span className="font-bold text-gray-900">12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link href="/admin/visas" className="text-primary-600 text-sm font-medium">
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Application ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Destination
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {app.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{app.customer}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{app.destination}</td>
                      <td className="px-4 py-4 text-sm text-gray-700">{app.type}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`badge text-xs ${
                            app.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : app.status === 'UNDER_REVIEW'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {app.amount}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{app.date}</td>
                      <td className="px-4 py-4">
                        <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  );
}

