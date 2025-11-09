'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
  Download,
  AlertCircle,
  Clock,
} from 'lucide-react';

export default function ApplicationReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [applicationId, setApplicationId] = useState<string>('');
  const [adminNote, setAdminNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const initializeAndLoad = async () => {
      const resolvedParams = await params;
      setApplicationId(resolvedParams.id);
      loadApplication(resolvedParams.id);
    };
    initializeAndLoad();
  }, []);

  const loadApplication = async (id: string) => {
    try {
      const response = await fetch(`/api/visa-applications/${id}`);
      const data = await response.json();

      if (response.ok) {
        setApplication(data.application);
      }
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this application?')) return;

    setActionLoading(true);
    try {
      const response = await fetch(
        `/api/admin/applications/${applicationId}/approve`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: adminNote }),
        }
      );

      if (response.ok) {
        alert('Application approved successfully!');
        router.push('/admin');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to approve application');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (!confirm('Are you sure you want to reject this application?')) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason, notes: adminNote }),
      });

      if (response.ok) {
        alert('Application rejected');
        router.push('/admin');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!adminNote.trim()) {
      alert('Please enter a note');
      return;
    }

    try {
      const response = await fetch(`/api/admin/applications/${applicationId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: adminNote, noteType: 'general' }),
      });

      if (response.ok) {
        alert('Note added successfully');
        setAdminNote('');
        loadApplication(applicationId);
      }
    } catch (error) {
      console.error('Add note error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Clock className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Not Found
          </h2>
          <button onClick={() => router.push('/admin')} className="btn-primary mt-4">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Applications
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Review
              </h1>
              <p className="text-gray-600 mt-2">
                {application.application_number}
              </p>
            </div>
            <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              {application.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Applicant Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Applicant Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {application.first_name} {application.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {application.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {application.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {application.date_of_birth
                      ? new Date(application.date_of_birth).toLocaleDateString()
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Travel Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Purpose of Travel
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {application.travel_purpose || 'Tourism'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Intended Entry Date
                  </label>
                  <p className="text-gray-900 font-semibold mt-1">
                    {application.intended_travel_date
                      ? new Date(application.intended_travel_date).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                <button
                  onClick={() => router.push('/admin/documents')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Open in Document Viewer →
                </button>
              </div>
              <p className="text-gray-600">
                View and verify documents in the document verification system
              </p>
            </div>

            {/* Admin Notes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Admin Notes
              </h2>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="input-field mb-4"
                rows={4}
                placeholder="Add notes about this application..."
              />
              <button
                onClick={handleAddNote}
                className="btn-outline flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Add Note
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>

              {!showRejectForm ? (
                <div className="space-y-3">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approve Application
                  </button>

                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Reject Application
                  </button>

                  <button
                    onClick={() =>
                      router.push(`/dashboard/applications/${applicationId}`)
                    }
                    className="w-full btn-outline flex items-center justify-center"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    View Full Details
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="input-field"
                    rows={4}
                    placeholder="Provide a clear reason for rejection..."
                    required
                  />
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                  <button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectionReason('');
                    }}
                    className="w-full btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Application Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Application Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">
                    {new Date(application.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {new Date(application.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span
                    className={`font-medium ${
                      application.payment_status === 'paid'
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {application.payment_status || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2 text-sm">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Contact Applicant
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors">
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Documents
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-colors">
                  <FileText className="w-4 h-4 inline mr-2" />
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

