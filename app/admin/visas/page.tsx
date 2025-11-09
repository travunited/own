'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export default function AdminVisasPage() {
  const [filters, setFilters] = useState({
    status: 'all',
    country: 'all',
    assigned: 'all',
    dateRange: '7days',
  });

  // Mock data - will be replaced with actual API call
  const applications = [
    {
      id: 'TRV12345',
      customer: 'John Doe',
      email: 'john@email.com',
      country: 'Dubai',
      visaType: 'Tourist - 30 Days',
      status: 'UNDER_REVIEW',
      travellers: 2,
      amount: 11000,
      createdAt: '2024-11-08T10:25:00',
      assignedTo: 'You',
      sla: 'on-time',
      priority: 'normal',
    },
    {
      id: 'TRV12344',
      customer: 'Jane Smith',
      email: 'jane@email.com',
      country: 'Singapore',
      visaType: 'Business Visa',
      status: 'DOCS_PENDING',
      travellers: 1,
      amount: 8000,
      createdAt: '2024-11-08T09:15:00',
      assignedTo: 'Amit Kumar',
      sla: 'due-soon',
      priority: 'high',
    },
    {
      id: 'TRV12343',
      customer: 'Rahul Patel',
      email: 'rahul@email.com',
      country: 'UK',
      visaType: 'Tourist Visa',
      status: 'APPROVED',
      travellers: 2,
      amount: 26000,
      createdAt: '2024-11-07T14:30:00',
      assignedTo: 'Priya Sharma',
      sla: 'completed',
      priority: 'normal',
    },
    {
      id: 'TRV12342',
      customer: 'Anita Desai',
      email: 'anita@email.com',
      country: 'Schengen',
      visaType: 'Tourist Visa',
      status: 'SUBMITTED_TO_EMBASSY',
      travellers: 3,
      amount: 32000,
      createdAt: '2024-11-06T11:20:00',
      assignedTo: 'You',
      sla: 'on-time',
      priority: 'normal',
    },
    {
      id: 'TRV12341',
      customer: 'Vikram Singh',
      email: 'vikram@email.com',
      country: 'Thailand',
      visaType: 'Tourist Visa',
      status: 'IN_PROGRESS',
      travellers: 4,
      amount: 18000,
      createdAt: '2024-11-05T16:45:00',
      assignedTo: 'Amit Kumar',
      sla: 'on-time',
      priority: 'normal',
    },
  ];

  const stats = [
    { label: 'Pending Review', value: 24, color: 'bg-orange-100 text-orange-600', icon: Clock },
    { label: 'Under Process', value: 78, color: 'bg-blue-100 text-blue-600', icon: AlertCircle },
    { label: 'Approved Today', value: 12, color: 'bg-green-100 text-green-600', icon: CheckCircle },
    { label: 'Assigned to You', value: 8, color: 'bg-purple-100 text-purple-600', icon: UserCheck },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PAYMENT_PENDING: 'bg-yellow-100 text-yellow-800',
      DOCS_PENDING: 'bg-orange-100 text-orange-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      SUBMITTED_TO_EMBASSY: 'bg-indigo-100 text-indigo-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      DISPATCHED: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSLAColor = (sla: string) => {
    const colors: Record<string, string> = {
      'on-time': 'text-green-600',
      'due-soon': 'text-orange-600',
      'overdue': 'text-red-600',
      'completed': 'text-gray-600',
    };
    return colors[sla] || 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visa Applications</h1>
          <p className="text-gray-600 mt-1">Manage and process visa applications</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-outline flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
          <button className="btn-outline flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by ID, name, passport..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="DOCS_PENDING">Docs Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SUBMITTED_TO_EMBASSY">Submitted</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            className="input-field"
          >
            <option value="all">All Countries</option>
            <option value="dubai">Dubai</option>
            <option value="singapore">Singapore</option>
            <option value="uk">UK</option>
            <option value="schengen">Schengen</option>
          </select>
          <select
            value={filters.assigned}
            onChange={(e) => setFilters({ ...filters, assigned: e.target.value })}
            className="input-field"
          >
            <option value="all">All Assigned</option>
            <option value="me">Assigned to Me</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Application ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Travellers
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  SLA
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.id}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.customer}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.country}</p>
                      <p className="text-xs text-gray-500">{app.visaType}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${getStatusColor(app.status)}`}>
                      {app.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{app.travellers}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{app.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-medium ${getSLAColor(app.sla)}`}>
                      {app.sla === 'on-time' && '✓ On Time'}
                      {app.sla === 'due-soon' && '⚠ Due Soon'}
                      {app.sla === 'overdue' && '✗ Overdue'}
                      {app.sla === 'completed' && '✓ Done'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/visas/${app.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing 1 to 5 of 127 applications
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="card bg-gray-50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">0 applications selected</p>
          <div className="flex items-center space-x-2">
            <select className="input-field text-sm">
              <option>Bulk Actions</option>
              <option>Assign to Team Member</option>
              <option>Change Status</option>
              <option>Export Selected</option>
              <option>Send Reminder</option>
            </select>
            <button className="btn-primary text-sm">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

