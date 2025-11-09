'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTickets();
  }, [statusFilter]);

  const loadTickets = async () => {
    try {
      const response = await fetch(
        `/api/support/tickets?status=${statusFilter}`
      );
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

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      open: { icon: AlertCircle, color: 'blue', label: 'Open' },
      in_progress: { icon: Clock, color: 'yellow', label: 'In Progress' },
      waiting: { icon: Clock, color: 'orange', label: 'Waiting' },
      resolved: { icon: CheckCircle, color: 'green', label: 'Resolved' },
      closed: { icon: CheckCircle, color: 'gray', label: 'Closed' },
    };
    return configs[status] || configs.open;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      ticket.ticket_number?.toLowerCase().includes(term) ||
      ticket.subject?.toLowerCase().includes(term) ||
      ticket.user?.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-2">
            Manage and respond to user support requests
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tickets.filter((t) => t.status === 'open').length}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tickets.filter((t) => t.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tickets.filter((t) => t.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-3xl font-bold text-gray-900">
                  {tickets.filter((t) => t.priority === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting">Waiting</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Tickets ({filteredTickets.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Clock className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading tickets...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No tickets found
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Support tickets will appear here'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTickets.map((ticket) => {
                    const statusConfig = getStatusConfig(ticket.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={ticket.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {ticket.ticket_number}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {ticket.subject}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">
                                {ticket.user?.full_name || 'User'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {ticket.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {ticket.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getPriorityColor(
                              ticket.priority
                            )}-100 text-${getPriorityColor(ticket.priority)}-800`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              router.push(`/admin/support/tickets/${ticket.id}`)
                            }
                            className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
