'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  application_number: string;
  status: string;
  payment_status: string;
  created_at: string;
  visa_type: {
    name: string;
    country: {
      name: string;
      flag_emoji: string;
    };
  };
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  invoice_number: string;
}

interface Document {
  id: string;
  document_name: string;
  verification_status: string;
  uploaded_at: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  created_at: string;
  icon: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    activeApplications: 0,
    completedApplications: 0,
    pendingDocuments: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch real dashboard data from API
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) {
        throw new Error('Failed to load dashboard data');
      }
      
      const data = await response.json();
      
      // Set applications
      setApplications(data.applications || []);
      
      // Set stats
      setStats({
        activeApplications: data.stats?.activeApplications || 0,
        completedApplications: data.stats?.completedApplications || 0,
        pendingDocuments: data.stats?.pendingDocuments || 0,
        totalSpent: data.stats?.totalSpent || 0,
      });
      
      // Set activities
      setActivities(data.activities || []);
      
      // Set payments
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Keep empty arrays on error
      setApplications([]);
      setActivities([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, any> = {
      draft: { color: 'gray', label: 'Draft', icon: FileText },
      submitted: { color: 'blue', label: 'Submitted', icon: Clock },
      in_review: { color: 'yellow', label: 'In Review', icon: Clock },
      approved: { color: 'green', label: 'Approved', icon: CheckCircle },
      rejected: { color: 'red', label: 'Rejected', icon: AlertCircle },
    };
    return configs[status] || configs.draft;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your visa applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Applications */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 opacity-75" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.activeApplications}</h3>
            <p className="text-blue-100 text-sm">Active Applications</p>
          </div>

          {/* Completed */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                All time
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.completedApplications}</h3>
            <p className="text-green-100 text-sm">Completed</p>
          </div>

          {/* Pending Documents */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Upload className="w-6 h-6" />
              </div>
              <AlertCircle className="w-5 h-5 opacity-75" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.pendingDocuments}</h3>
            <p className="text-orange-100 text-sm">Pending Documents</p>
          </div>

          {/* Total Spent */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg transform transition hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              ₹{stats.totalSpent.toLocaleString('en-IN')}
            </h3>
            <p className="text-purple-100 text-sm">Total Spent</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Applications */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Applications</h2>
                <Link href="/visas" className="btn-primary text-sm">
                  <Plus className="w-4 h-4 mr-1" />
                  New Application
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No active applications
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your visa application journey today
                  </p>
                  <Link href="/visas" className="btn-primary">
                    <Plus className="w-5 h-5 mr-2" />
                    Apply for Visa
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={app.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => router.push(`/dashboard/applications/${app.id}`)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="text-4xl">{app.visa_type.country.flag_emoji}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {app.visa_type.country.name} - {app.visa_type.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Application #{app.application_number}
                              </p>
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-800`}
                                >
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig.label}
                                </span>
                                {app.payment_status === 'paid' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Paid
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No recent activity</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <FileText className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link
                  href="/visas"
                  className="flex items-center p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg hover:from-primary-100 hover:to-blue-100 transition-colors group"
                >
                  <div className="p-2 bg-primary-600 rounded-lg mr-3">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">New Application</p>
                    <p className="text-xs text-gray-600">Start visa process</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </Link>

                <Link
                  href="/dashboard/documents"
                  className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-colors group"
                >
                  <div className="p-2 bg-green-600 rounded-lg mr-3">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Upload Documents</p>
                    <p className="text-xs text-gray-600">Add required files</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </Link>

                <Link
                  href="/dashboard/payments"
                  className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors group"
                >
                  <div className="p-2 bg-purple-600 rounded-lg mr-3">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Payment History</p>
                    <p className="text-xs text-gray-600">View transactions</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </Link>

                <Link
                  href="/support"
                  className="flex items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg hover:from-orange-100 hover:to-yellow-100 transition-colors group"
                >
                  <div className="p-2 bg-orange-600 rounded-lg mr-3">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Get Support</p>
                    <p className="text-xs text-gray-600">Need help?</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Document Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Document Status</h2>
              
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.document_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {doc.verification_status === 'verified' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment History Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
                <Link href="/dashboard/payments" className="text-sm text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No payments yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{(payment.amount / 100).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">{payment.invoice_number}</p>
                      </div>
                      {payment.status === 'captured' ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          Paid
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                          Pending
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
