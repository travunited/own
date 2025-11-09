'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/visa/StatusBadge';
import ApplicationTimeline from '@/components/visa/ApplicationTimeline';
import {
  ArrowLeft,
  Download,
  FileText,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await fetch(`/api/visa-applications/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch application');
      }

      setApplication(data.application);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !application) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The application you\'re looking for doesn\'t exist.'}</p>
          <Link href="/dashboard/applications" className="btn-primary">
            Back to Applications
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Application #{application.application_number}
              </h1>
              <p className="text-gray-600 mt-1">
                {application.visa_type?.country?.name} - {application.visa_type?.name}
              </p>
            </div>
          </div>
          <StatusBadge status={application.status} size="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Travelers</p>
                    <p className="text-2xl font-bold text-gray-900">{application.total_travelers}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">₹{application.total_amount?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Processing</p>
                    <p className="text-sm font-bold text-gray-900">{application.processing_speed}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Application Number</p>
                    <p className="font-semibold text-gray-900">{application.application_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Submitted On</p>
                    <p className="font-semibold text-gray-900">
                      {application.submitted_at 
                        ? new Date(application.submitted_at).toLocaleDateString()
                        : 'Not submitted yet'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Visa Type</p>
                    <p className="font-semibold text-gray-900">{application.visa_type?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Country</p>
                    <p className="font-semibold text-gray-900">{application.visa_type?.country?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Processing Speed</p>
                    <p className="font-semibold text-gray-900 capitalize">{application.processing_speed}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <p className="font-semibold text-gray-900 capitalize">{application.payment_status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Travelers */}
            {application.travelers?.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Travelers</h3>
                <div className="space-y-3">
                  {application.travelers.map((traveler: any) => (
                    <div key={traveler.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {traveler.first_name} {traveler.middle_name} {traveler.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {traveler.passport_number} • {traveler.nationality}
                          </p>
                        </div>
                        {traveler.is_primary && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                            Primary
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {application.documents?.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                <div className="space-y-2">
                  {application.documents.map((doc: any) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.document_name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.verification_status === 'verified' && '✓ Verified'}
                            {doc.verification_status === 'pending' && '⏳ Pending Review'}
                            {doc.verification_status === 'rejected' && '✗ Rejected'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-semibold text-primary-600">
                      {application.completion_percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all"
                      style={{ width: `${application.completion_percentage}%` }}
                    />
                  </div>
                </div>

                {application.estimated_completion_date && (
                  <div className="flex items-start text-sm">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-gray-600">Estimated Completion</p>
                      <p className="font-medium text-gray-900">
                        {new Date(application.estimated_completion_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Pricing</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Government Fee</span>
                  <span className="font-medium">₹{application.government_fee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">₹{application.service_fee?.toLocaleString()}</span>
                </div>
                {application.addon_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Add-ons</span>
                    <span className="font-medium">₹{application.addon_fees?.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-2 mt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    ₹{application.total_amount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <button className="w-full btn-primary mb-3">
                <Download className="w-4 h-4 mr-2" />
                Download Application
              </button>
              {application.status === 'visa_issued' && (
                <button className="w-full btn-primary bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Visa
                </button>
              )}
            </div>

            {/* Help */}
            <div className="card bg-primary-50 border-primary-100">
              <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for assistance
              </p>
              <Link href="/dashboard/support" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Application Timeline</h3>
          {application.timeline && application.timeline.length > 0 ? (
            <ApplicationTimeline
              events={application.timeline}
              currentStatus={application.status}
            />
          ) : (
            <p className="text-gray-500 text-center py-8">No timeline events yet</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

