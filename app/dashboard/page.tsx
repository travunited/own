'use client';

import Link from 'next/link';
import {
  FileText,
  Plane,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {

  const stats = [
    {
      icon: FileText,
      label: 'Active Visas',
      value: '2',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Plane,
      label: 'Upcoming Tours',
      value: '1',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Clock,
      label: 'Pending Actions',
      value: '3',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: '5',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const recentApplications = [
    {
      id: 'TRV12345',
      type: 'Visa',
      destination: 'Dubai, UAE',
      status: 'UNDER_REVIEW',
      date: '2024-11-01',
      travelers: 2,
    },
    {
      id: 'TRV12344',
      type: 'Visa',
      destination: 'Singapore',
      status: 'APPROVED',
      date: '2024-10-28',
      travelers: 1,
    },
    {
      id: 'TOUR5678',
      type: 'Tour',
      destination: 'Maldives',
      status: 'CONFIRMED',
      date: '2024-10-25',
      travelers: 2,
    },
  ];

  const pendingActions = [
    {
      id: 1,
      title: 'Upload Missing Document',
      description: 'Passport copy required for Dubai visa',
      type: 'urgent',
      link: '/dashboard/visas/TRV12345',
    },
    {
      id: 2,
      title: 'Review Tour Itinerary',
      description: 'Confirm Maldives tour details',
      type: 'info',
      link: '/dashboard/tours/TOUR5678',
    },
    {
      id: 3,
      title: 'Complete Payment',
      description: 'Pending payment for Singapore visa',
      type: 'warning',
      link: '/dashboard/payments',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your travel plans</p>
      </div>
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Link
              href="/visa-apply"
              className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-primary-500 to-primary-600 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">Apply for New Visa</h3>
                  <p className="text-sm text-primary-100">
                    Start a new visa application
                  </p>
                </div>
                <Plus className="w-12 h-12 opacity-50" />
              </div>
            </Link>
            <Link
              href="/tours"
              className="card hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-500 to-green-600 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">Browse Tour Packages</h3>
                  <p className="text-sm text-green-100">
                    Explore curated tours
                  </p>
                </div>
                <Plane className="w-12 h-12 opacity-50" />
              </div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Applications
                  </h2>
                  <Link href="/dashboard/visas" className="text-primary-600 text-sm font-medium">
                    View All →
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-gray-900 mr-2">
                              {app.id}
                            </span>
                            <span
                              className={`badge text-xs ${
                                app.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : app.status === 'UNDER_REVIEW'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {app.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {app.destination}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="w-3 h-3 mr-1" />
                            <span>{app.travelers} Traveller(s)</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(app.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/${app.type.toLowerCase()}s/${app.id}`}
                          className="text-primary-600 text-sm font-medium hover:text-primary-700"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div>
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Pending Actions
                </h2>

                <div className="space-y-4">
                  {pendingActions.map((action) => (
                    <div
                      key={action.id}
                      className={`border-l-4 rounded p-3 ${
                        action.type === 'urgent'
                          ? 'border-red-500 bg-red-50'
                          : action.type === 'warning'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <h3 className="font-bold text-sm text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {action.description}
                      </p>
                      <Link
                        href={action.link}
                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Take Action →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="card mt-6">
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/track"
                    className="block text-sm text-gray-700 hover:text-primary-600"
                  >
                    → Track Application
                  </Link>
                  <Link
                    href="/dashboard/support"
                    className="block text-sm text-gray-700 hover:text-primary-600"
                  >
                    → Contact Support
                  </Link>
                  <Link
                    href="/dashboard/travellers"
                    className="block text-sm text-gray-700 hover:text-primary-600"
                  >
                    → Manage Travellers
                  </Link>
                  <Link
                    href="/dashboard/payments"
                    className="block text-sm text-gray-700 hover:text-primary-600"
                  >
                    → Payment History
                  </Link>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}

