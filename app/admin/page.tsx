'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Upload,
  User,
  Filter,
  Search,
  Eye,
  Edit,
  MoreVertical,
  Bell,
} from 'lucide-react';

interface Application {
  id: string;
  application_number: string;
  status: string;
  payment_status: string;
  created_at: string;
  user_name: string;
  user_email: string;
  visa_type: string;
  country: string;
  flag_emoji: string;
  pending_documents: number;
  admin_notes: string | null;
  last_updated: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState({
    pendingReview: 0,
    documentsToVerify: 0,
    supportTickets: 0,
    approvedToday: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, selectedStatus, searchTerm]);

  const loadDashboardData = async () => {
    try {
      // Fetch stats from API
      const statsResponse = await fetch('/api/admin/dashboard/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          pendingReview: statsData.stats?.pendingReview || 0,
          documentsToVerify: statsData.stats?.documentsToVerify || 0,
          supportTickets: statsData.stats?.supportTickets || 0,
          approvedToday: statsData.stats?.approvedToday || 0,
        });
      }

      // Fetch applications from API
      const appsResponse = await fetch('/api/admin/applications?status=all&limit=50');
      if (appsResponse.ok) {
        const appsData = await appsResponse.json();
        
        // Transform data to match component interface
        const transformedApps = (appsData.applications || []).map((app: any) => ({
          id: app.id,
          application_number: app.application_number,
          status: app.status,
          payment_status: app.payment_status,
          created_at: app.created_at,
          user_name: app.user?.full_name || app.user?.username || 'Unknown',
          user_email: app.user?.email || 'N/A',
          visa_type: app.visa_type?.name || 'N/A',
          country: app.visa_type?.country?.name || 'N/A',
          flag_emoji: app.visa_type?.country?.flag_emoji || '🌍',
          pending_documents: app.pending_documents || 0,
          admin_notes: null,
          last_updated: app.updated_at,
        }));
        
        setApplications(transformedApps);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Keep empty arrays on error
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((app) => app.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.application_number.toLowerCase().includes(term) ||
          app.user_name.toLowerCase().includes(term) ||
          app.user_email.toLowerCase().includes(term) ||
          app.country.toLowerCase().includes(term)
      );
    }

    setFilteredApplications(filtered);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      application_started: { label: 'Started', color: 'gray', icon: Clock },
      documents_submitted: { label: 'Documents Submitted', color: 'blue', icon: Upload },
      under_review: { label: 'Under Review', color: 'yellow', icon: Eye },
      approved: { label: 'Approved', color: 'green', icon: CheckCircle },
      rejected: { label: 'Rejected', color: 'red', icon: XCircle },
      payment_completed: { label: 'Payment Completed', color: 'purple', icon: CheckCircle },
    };
    return configs[status] || configs.application_started;
  };

  const statCards = [
    {
      title: 'Pending Review',
      value: stats.pendingReview,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      borderColor: 'border-yellow-200',
    },
    {
      title: 'Documents to Verify',
      value: stats.documentsToVerify,
      icon: Upload,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Support Tickets',
      value: stats.supportTickets,
      icon: MessageSquare,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Approved Today',
      value: stats.approvedToday,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
  ];

  const statusFilters = [
    { value: 'all', label: 'All Applications' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'documents_submitted', label: 'Documents Submitted' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Application review & document verification
              </p>
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className={`${stat.bgColor} border-2 ${stat.borderColor} rounded-xl p-6 transition-all hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-white rounded-lg shadow-sm`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-700">{stat.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by application number, name, email, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-xl shadow-md">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Applications ({filteredApplications.length})
            </h2>
          </div>

          {/* Table */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search term
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Application Number */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {app.application_number}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </td>

                        {/* User */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {app.user_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {app.user_email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Destination */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl mr-2">{app.flag_emoji}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {app.country}
                              </p>
                              <p className="text-xs text-gray-500">{app.visa_type}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Documents */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {app.pending_documents > 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {app.pending_documents} pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Complete
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                router.push(`/admin/applications/${app.id}/review`)
                              }
                              className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                              title="Review Application"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                router.push(`/dashboard/applications/${app.id}`)
                              }
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="More Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <button
            onClick={() => router.push('/admin/documents')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Upload className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-2">Verify Documents</h3>
            <p className="text-sm text-blue-100">
              {stats.documentsToVerify} documents pending verification
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/support')}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-2">Support Tickets</h3>
            <p className="text-sm text-orange-100">
              {stats.supportTickets} tickets need attention
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            <User className="w-8 h-8 mb-3" />
            <h3 className="text-lg font-bold mb-2">User Management</h3>
            <p className="text-sm text-purple-100">View profiles & communication</p>
          </button>
        </div>
      </div>
    </div>
  );
}
