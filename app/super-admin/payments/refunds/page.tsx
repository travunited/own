'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Search,
  Filter,
  AlertTriangle,
} from 'lucide-react';

export default function RefundManagementPage() {
  const supabase = createClientComponentClient();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    loadRefunds();
  }, [filterStatus]);

  const loadRefunds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/payments/refunds?status=${filterStatus}`);
      const data = await response.json();

      if (data.success) {
        setRefunds(data.refunds || []);
        
        // Calculate stats
        const pending = data.refunds.filter((r: any) => r.status === 'pending').length;
        const approved = data.refunds.filter((r: any) => r.status === 'approved').length;
        const rejected = data.refunds.filter((r: any) => r.status === 'rejected').length;
        const totalAmount = data.refunds
          .filter((r: any) => r.status === 'approved')
          .reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

        setStats({ pending, approved, rejected, totalAmount });
      }
    } catch (error) {
      console.error('Error loading refunds:', error);
      alert('Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (refundId: string) => {
    if (!confirm('Are you sure you want to approve this refund? The amount will be processed through Razorpay.')) {
      return;
    }

    try {
      setProcessing(refundId);
      const response = await fetch(`/api/super-admin/payments/refunds/${refundId}/approve`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        alert('Refund approved and processed successfully!');
        await loadRefunds();
      } else {
        alert(`Failed to approve refund: ${data.error}`);
      }
    } catch (error) {
      console.error('Error approving refund:', error);
      alert('Failed to approve refund');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (refundId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      setProcessing(refundId);
      const response = await fetch(`/api/super-admin/payments/refunds/${refundId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejection_reason: reason }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Refund rejected successfully');
        await loadRefunds();
      } else {
        alert(`Failed to reject refund: ${data.error}`);
      }
    } catch (error) {
      console.error('Error rejecting refund:', error);
      alert('Failed to reject refund');
    } finally {
      setProcessing(null);
    }
  };

  const filteredRefunds = refunds.filter(
    (refund) =>
      refund.payment?.application?.application_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.payment?.application?.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.payment?.application?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading refunds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Refund Management</h1>
            <p className="text-gray-600">Process and track refund requests</p>
          </div>
          <button
            onClick={loadRefunds}
            className="btn-outline flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Refunded</p>
                <p className="text-3xl font-bold text-primary-600 mt-2">
                  ₹{(stats.totalAmount / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by application, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              {filteredRefunds.length} Refund Request{filteredRefunds.length !== 1 ? 's' : ''}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {refund.payment?.application?.application_number || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">
                          {refund.payment?.application?.user?.full_name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {refund.payment?.application?.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-gray-900">
                        ₹{refund.amount?.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {refund.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          refund.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : refund.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : refund.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(refund.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {refund.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(refund.id)}
                            disabled={processing === refund.id}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            {processing === refund.id ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleReject(refund.id)}
                            disabled={processing === refund.id}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {refund.status === 'approved' && (
                        <span className="text-green-600">✓ Processed</span>
                      )}
                      {refund.status === 'rejected' && (
                        <span className="text-red-600" title={refund.rejection_reason}>
                          ✗ Rejected
                        </span>
                      )}
                      {refund.status === 'failed' && (
                        <span className="text-red-600" title={refund.error_message}>
                          <AlertTriangle className="w-4 h-4 inline" /> Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRefunds.length === 0 && (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No refund requests found</h3>
              <p className="text-gray-600">
                {filterStatus === 'all'
                  ? 'There are no refund requests in the system'
                  : `No ${filterStatus} refund requests`}
              </p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Important Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Approved refunds are automatically processed through Razorpay</li>
                <li>• Refund processing may take 5-7 business days to reflect in user's account</li>
                <li>• All refund actions are logged in the audit trail</li>
                <li>• Rejected refunds can be reconsidered by creating a new request</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

