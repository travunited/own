'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium',
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await fetch('/api/support/tickets');
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Ticket created successfully!');
        setShowCreateForm(false);
        setFormData({
          subject: '',
          description: '',
          category: 'general',
          priority: 'medium',
        });
        loadTickets();
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'blue';
      case 'in_progress':
        return 'yellow';
      case 'resolved':
        return 'green';
      case 'closed':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return AlertCircle;
      case 'in_progress':
        return Clock;
      case 'resolved':
        return CheckCircle;
      case 'closed':
        return CheckCircle;
      default:
        return MessageSquare;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Support Center</h1>
            <p className="text-gray-600">
              Need help? Create a ticket and our team will assist you.
            </p>
          </div>

          {/* Create Ticket Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Ticket
            </button>
          </div>

          {/* Create Ticket Form */}
          {showCreateForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Create Support Ticket
              </h2>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="visa">Visa Application</option>
                      <option value="tour">Tour Booking</option>
                      <option value="payment">Payment Issue</option>
                      <option value="technical">Technical Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input-field"
                    rows={6}
                    placeholder="Please describe your issue in detail..."
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-primary"
                  >
                    {loading ? 'Creating...' : 'Create Ticket'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets List */}
          <div className="bg-white rounded-xl shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">
                Your Support Tickets ({tickets.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No support tickets yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Create a ticket if you need assistance
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Create Your First Ticket
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {tickets.map((ticket) => {
                  const StatusIcon = getStatusIcon(ticket.status);
                  const statusColor = getStatusColor(ticket.status);

                  return (
                    <div
                      key={ticket.id}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/support/tickets/${ticket.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-mono text-gray-600">
                              {ticket.ticket_number}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {ticket.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {ticket.subject}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {ticket.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Created {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Eye className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

