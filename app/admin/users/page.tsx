'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Eye, Ban, Mail } from 'lucide-react';

export default function AdminUsersPage() {
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@email.com',
      phone: '+91 9876543210',
      memberSince: '2024-01-15',
      applications: 5,
      totalSpent: 55000,
      status: 'Active',
      lastActive: '2024-11-08',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@email.com',
      phone: '+91 9876543211',
      memberSince: '2024-03-20',
      applications: 2,
      totalSpent: 38000,
      status: 'Active',
      lastActive: '2024-11-07',
    },
    {
      id: '3',
      name: 'Rahul Kumar',
      email: 'rahul@email.com',
      phone: '+91 9876543212',
      memberSince: '2024-02-10',
      applications: 8,
      totalSpent: 92000,
      status: 'Active',
      lastActive: '2024-11-08',
    },
  ];

  const stats = [
    { label: 'Total Users', value: '2,456' },
    { label: 'New This Month', value: '145' },
    { label: 'Active Users', value: '1,892' },
    { label: 'Avg LTV', value: '₹45,600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage customer accounts and activity</p>
        </div>
        <button className="btn-outline flex items-center">
          <Download className="w-5 h-5 mr-2" />
          Export Users
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              className="input-field pl-10"
            />
          </div>
          <select className="input-field">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Blocked</option>
          </select>
          <select className="input-field">
            <option>All Time</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Member Since
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Applications
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Total Spent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="font-bold text-primary-600 text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{user.email}</p>
                      <p className="text-gray-500">{user.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {new Date(user.memberSince).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                    {user.applications}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-primary-600">
                    ₹{user.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge bg-green-100 text-green-800 text-xs">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
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

