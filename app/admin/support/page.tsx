'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, MessageSquare, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSupportPage() {
  const tickets = [
    {
      id: 'T001',
      ticketNumber: 'TICKET-001',
      customer: 'John Doe',
      subject: 'Document Upload Issue',
      category: 'Visa',
      priority: 'High',
      status: 'Open',
      reference: 'TRV12345',
      createdAt: '2024-11-08T10:45:00',
      lastUpdated: '2024-11-08T12:30:00',
      assignedTo: 'You',
      messages: 3,
    },
    {
      id: 'T002',
      ticketNumber: 'TICKET-002',
      customer: 'Jane Smith',
      subject: 'Payment Failed',
      category: 'Payment',
      priority: 'Medium',
      status: 'In Progress',
      reference: 'ORD12346',
      createdAt: '2024-11-08T09:20:00',
      lastUpdated: '2024-11-08T11:45:00',
      assignedTo: 'Amit Kumar',
      messages: 5,
    },
    {
      id: 'T003',
      ticketNumber: 'TICKET-003',
      customer: 'Rahul Patel',
      subject: 'Tour Customization Query',
      category: 'Tour',
      priority: 'Low',
      status: 'Resolved',
      reference: 'TOUR001',
      createdAt: '2024-11-07T14:30:00',
      lastUpdated: '2024-11-08T10:15:00',
      assignedTo: 'Priya Sharma',
      messages: 7,
    },
  ];

  const stats = [
    {
      label: 'Open Tickets',
      value: '8',
      icon: MessageSquare,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'In Progress',
      value: '5',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Resolved Today',
      value: '12',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Avg Response',
      value: '2.5h',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-orange-100 text-orange-800',
      Low: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Open: 'bg-orange-100 text-orange-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      Resolved: 'bg-green-100 text-green-800',
      Closed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">Manage customer support tickets</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/support/templates" className="btn-outline">
            Templates
          </Link>
          <button className="btn-primary">Refresh</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="input-field pl-10"
            />
          </div>
          <select className="input-field">
            <option>All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>
          <select className="input-field">
            <option>All Priority</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="input-field">
            <option>All Assigned</option>
            <option>Assigned to Me</option>
            <option>Unassigned</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Ticket ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Subject
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Assigned
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.ticketNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {ticket.messages} messages
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{ticket.customer}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-500">Ref: {ticket.reference}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge bg-gray-100 text-gray-800 text-xs">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{ticket.assignedTo}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {new Date(ticket.lastUpdated).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/support/${ticket.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View
                    </Link>
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

