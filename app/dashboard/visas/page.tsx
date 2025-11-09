'use client';

import Link from 'next/link';
import { FileText, Clock, CheckCircle, Eye, Download, AlertCircle } from 'lucide-react';

export default function DashboardVisasPage() {
  const applications = [
    {
      id: 'TRV12345',
      country: 'Dubai, UAE',
      visaType: 'Tourist - 30 Days',
      status: 'UNDER_REVIEW',
      travellers: 2,
      amount: 11000,
      appliedDate: '2024-11-08',
      estimatedCompletion: '2024-11-12',
      progress: 60,
    },
    {
      id: 'TRV12344',
      country: 'Singapore',
      visaType: 'Tourist Visa',
      status: 'APPROVED',
      travellers: 1,
      amount: 8000,
      appliedDate: '2024-10-28',
      estimatedCompletion: '2024-11-02',
      progress: 100,
      approvedDate: '2024-11-01',
    },
    {
      id: 'TRV12343',
      country: 'Thailand',
      visaType: 'Tourist Visa',
      status: 'DOCS_PENDING',
      travellers: 2,
      amount: 7000,
      appliedDate: '2024-11-06',
      estimatedCompletion: '2024-11-10',
      progress: 40,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DOCS_PENDING: 'bg-orange-100 text-orange-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Visa Applications</h1>
          <p className="text-gray-600 mt-1">Track and manage your visa applications</p>
        </div>
        <Link href="/visa-apply" className="btn-primary">
          Apply for New Visa
        </Link>
      </div>

      {/* Applications Grid */}
      <div className="grid gap-6">
        {applications.map((app) => (
          <div key={app.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 mr-3">
                    {app.country}
                  </h3>
                  <span className={`badge ${getStatusColor(app.status)}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-gray-600">{app.visaType}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Application ID: {app.id}
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-2xl font-bold text-primary-600">
                  ₹{app.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600">{app.travellers} Traveller(s)</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing Progress</span>
                <span className="text-sm text-gray-600">{app.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${app.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Applied On</p>
                <p className="font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(app.appliedDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Completion</p>
                <p className="font-medium flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {new Date(app.estimatedCompletion).toLocaleDateString()}
                </p>
              </div>
              {app.status === 'APPROVED' && app.approvedDate && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Approved On</p>
                  <p className="font-medium flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {new Date(app.approvedDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <Link
                href={`/dashboard/visas/${app.id}`}
                className="btn-primary flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
              {app.status === 'APPROVED' && (
                <button className="btn-outline flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download Visa
                </button>
              )}
              {app.status === 'DOCS_PENDING' && (
                <Link href={`/dashboard/visas/${app.id}/upload`} className="btn-outline">
                  Upload Documents
                </Link>
              )}
              <Link href="/support" className="btn-outline">
                Contact Support
              </Link>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="card text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Visa Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            Start your journey by applying for a visa to your dream destination
          </p>
          <Link href="/visa-apply" className="btn-primary inline-flex items-center">
            Apply for Visa
          </Link>
        </div>
      )}
    </div>
  );
}

