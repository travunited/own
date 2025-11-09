'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function DashboardSupportPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const tickets = [
    {
      id: 'T001',
      ticketNumber: 'TICKET-001',
      subject: 'Document Upload Issue',
      category: 'Visa',
      status: 'Open',
      reference: 'TRV12345',
      createdAt: '2024-11-08T10:45:00',
      lastMessage: '2024-11-08T12:30:00',
      messages: 3,
    },
    {
      id: 'T002',
      ticketNumber: 'TICKET-002',
      subject: 'Payment Confirmation Query',
      category: 'Payment',
      status: 'Resolved',
      reference: 'ORD12345',
      createdAt: '2024-11-06T14:20:00',
      lastMessage: '2024-11-07T09:15:00',
      messages: 5,
    },
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Get help with your bookings and applications</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Ticket
        </button>
      </div>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Support Ticket</h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                placeholder="Brief description of your issue"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select className="input-field">
                <option>Select Category</option>
                <option>Visa Application</option>
                <option>Tour Booking</option>
                <option>Payment Issue</option>
                <option>Document Upload</option>
                <option>General Query</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Application/Booking (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., TRV12345 or TOUR001"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Describe your issue in detail..."
                rows={5}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="btn-primary">Submit Ticket</button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href={`/dashboard/support/${ticket.id}`}
            className="card hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="font-bold text-lg text-gray-900 mr-3">
                    {ticket.subject}
                  </h3>
                  <span className={`badge ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Ticket: {ticket.ticketNumber} • Category: {ticket.category}
                </p>
                {ticket.reference && (
                  <p className="text-sm text-gray-600">Related: {ticket.reference}</p>
                )}
              </div>
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Created {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
                <span>{ticket.messages} messages</span>
              </div>
              <span className="text-primary-600 font-medium">View Ticket →</span>
            </div>
          </Link>
        ))}
      </div>

      {tickets.length === 0 && !showCreateForm && (
        <div className="card text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Support Tickets</h3>
          <p className="text-gray-600 mb-6">
            Need help? Create a support ticket and we'll assist you
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Ticket
          </button>
        </div>
      )}
    </div>
  );
}

