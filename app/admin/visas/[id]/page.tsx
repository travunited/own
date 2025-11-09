'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  User,
  FileText,
  Clock,
  CreditCard,
  MessageSquare,
  Download,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Upload,
} from 'lucide-react';

export default function ApplicationDetailPage() {
  const params = useParams();
  const applicationId = params.id as string;
  const [activeTab, setActiveTab] = useState('travellers');

  // Mock data
  const application = {
    id: applicationId,
    applicationNumber: applicationId,
    customer: {
      name: 'John Doe',
      email: 'john@email.com',
      phone: '+91 9876543210',
    },
    visa: {
      country: 'Dubai, UAE',
      type: 'Tourist - 30 Days',
      processing: 'Standard',
    },
    status: 'UNDER_REVIEW',
    amount: 11000,
    travellers: 2,
    createdAt: '2024-11-08T10:25:00',
    assignedTo: 'You',
  };

  const travellers = [
    {
      id: '1',
      fullName: 'John Doe',
      dateOfBirth: '1985-01-15',
      passportNumber: 'A1234567',
      passportExpiry: '2028-12-20',
      nationality: 'Indian',
      gender: 'Male',
      isLead: true,
    },
    {
      id: '2',
      fullName: 'Jane Doe',
      dateOfBirth: '1987-03-10',
      passportNumber: 'B7654321',
      passportExpiry: '2027-11-15',
      nationality: 'Indian',
      gender: 'Female',
      isLead: false,
    },
  ];

  const documents = [
    {
      id: '1',
      travellerId: '1',
      travellerName: 'John Doe',
      type: 'Passport Copy',
      fileName: 'passport_john_doe.pdf',
      fileSize: 2.3,
      uploadedAt: '2024-11-08T10:30:00',
      status: 'APPROVED',
      reviewedBy: 'You',
    },
    {
      id: '2',
      travellerId: '1',
      travellerName: 'John Doe',
      type: 'Passport Photo',
      fileName: 'photo_john_doe.jpg',
      fileSize: 1.1,
      uploadedAt: '2024-11-08T10:32:00',
      status: 'UPLOADED',
      reviewedBy: null,
    },
    {
      id: '3',
      travellerId: '1',
      travellerName: 'John Doe',
      type: 'Flight Tickets',
      fileName: 'flight_booking.pdf',
      fileSize: 0.89,
      uploadedAt: '2024-11-08T10:35:00',
      status: 'APPROVED',
      reviewedBy: 'You',
    },
  ];

  const timeline = [
    {
      id: '1',
      status: 'Application Created',
      description: 'Customer started visa application',
      timestamp: '2024-11-08T10:25:00',
      user: 'System',
    },
    {
      id: '2',
      status: 'Travellers Added',
      description: '2 travellers added to application',
      timestamp: '2024-11-08T10:28:00',
      user: 'John Doe',
    },
    {
      id: '3',
      status: 'Documents Uploaded',
      description: 'All required documents uploaded',
      timestamp: '2024-11-08T10:35:00',
      user: 'John Doe',
    },
    {
      id: '4',
      status: 'Payment Successful',
      description: '₹11,000 paid via Razorpay',
      timestamp: '2024-11-08T10:40:00',
      user: 'System',
    },
    {
      id: '5',
      status: 'Assigned to Visa Ops',
      description: 'Assigned to: You',
      timestamp: '2024-11-08T11:15:00',
      user: 'System',
    },
    {
      id: '6',
      status: 'Under Review',
      description: 'Document verification in progress',
      timestamp: '2024-11-08T14:30:00',
      user: 'You',
    },
  ];

  const tabs = [
    { id: 'travellers', label: 'Travellers', icon: User },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PAYMENT_PENDING: 'bg-yellow-100 text-yellow-800',
      DOCS_PENDING: 'bg-orange-100 text-orange-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      SUBMITTED_TO_EMBASSY: 'bg-indigo-100 text-indigo-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      DISPATCHED: 'bg-teal-100 text-teal-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/visas"
        className="inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </Link>

      {/* Application Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Application {application.applicationNumber}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {application.customer.name}
              </span>
              <span className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {application.customer.email}
              </span>
              <span className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {application.customer.phone}
              </span>
            </div>
          </div>
          <span className={`badge ${getStatusColor(application.status)}`}>
            {application.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Country</p>
            <p className="font-medium">{application.visa.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Visa Type</p>
            <p className="font-medium">{application.visa.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Processing</p>
            <p className="font-medium">{application.visa.processing}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-medium text-primary-600">
              ₹{application.amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-6">
          <button className="btn-primary flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve Application
          </button>
          <button className="btn-outline flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Request Documents
          </button>
          <button className="btn-outline flex items-center text-red-600 border-red-600 hover:bg-red-50">
            <XCircle className="w-5 h-5 mr-2" />
            Reject
          </button>
          <button className="btn-outline flex items-center ml-auto">
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'travellers' && (
            <div className="space-y-6">
              {travellers.map((traveller, index) => (
                <div key={traveller.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">
                      Traveller {index + 1}
                      {traveller.isLead && (
                        <span className="ml-2 badge bg-primary-100 text-primary-800 text-sm">
                          Lead
                        </span>
                      )}
                    </h3>
                    <span className="badge bg-green-100 text-green-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Full Name</p>
                      <p className="font-medium">{traveller.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date of Birth</p>
                      <p className="font-medium">{traveller.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Gender</p>
                      <p className="font-medium">{traveller.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passport Number</p>
                      <p className="font-medium">{traveller.passportNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Passport Expiry</p>
                      <p className="font-medium">{traveller.passportExpiry}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Nationality</p>
                      <p className="font-medium">{traveller.nationality}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <FileText className="w-5 h-5 text-gray-400 mr-2" />
                        <h4 className="font-medium text-gray-900">{doc.type}</h4>
                        <span className="ml-2 text-xs text-gray-500">
                          ({doc.travellerName})
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{doc.fileName}</p>
                      <p className="text-xs text-gray-500">
                        {doc.fileSize} MB • Uploaded{' '}
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </p>
                      {doc.reviewedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reviewed by: {doc.reviewedBy}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {doc.status === 'APPROVED' ? (
                        <span className="badge bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="badge bg-blue-100 text-blue-800">Pending Review</span>
                      )}
                      <button className="btn-outline text-sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                      {doc.status !== 'APPROVED' && (
                        <>
                          <button className="btn-primary text-sm">Approve</button>
                          <button className="btn-outline text-sm text-red-600 border-red-600">
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {timeline.map((entry, index) => (
                <div key={entry.id} className="flex">
                  <div className="flex flex-col items-center mr-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-medium text-gray-900 mb-1">{entry.status}</p>
                    <p className="text-sm text-gray-600 mb-1">{entry.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()} • {entry.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="card bg-gray-50">
                <h3 className="font-bold text-lg mb-4">Payment Details</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">ORD67890XYZ</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Razorpay Order ID</p>
                    <p className="font-medium">order_xxx123</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment ID</p>
                    <p className="font-medium">pay_yyy456</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">UPI</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Date</p>
                    <p className="font-medium">Nov 8, 2024 10:40 AM</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className="badge bg-green-100 text-green-800">Success</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <h4 className="font-medium mb-3">Amount Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Base Visa Fee (2 travellers)</span>
                      <span className="font-medium">₹9,998</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">₹500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium">₹1,890</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-300">
                      <span className="font-bold">Total Paid</span>
                      <span className="font-bold text-lg text-primary-600">₹11,000</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button className="btn-outline text-sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download Invoice
                  </button>
                  <button className="btn-outline text-sm">Send Receipt</button>
                  <button className="btn-outline text-sm text-red-600 border-red-600">
                    Issue Refund
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-medium mb-3">Add Internal Note</h3>
                <textarea
                  className="input-field mb-3"
                  rows={4}
                  placeholder="Add notes visible to team only..."
                ></textarea>
                <div className="flex items-center space-x-3">
                  <button className="btn-primary">Save Note</button>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2" />
                    Notify customer
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-primary-600">YO</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">You</p>
                        <p className="text-xs text-gray-500">Nov 8, 2024 2:35 PM</p>
                      </div>
                    </div>
                    <span className="badge bg-gray-100 text-gray-800 text-xs">Internal</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-11">
                    Passport photo needs better white background. Requested re-upload via email.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-blue-600">AK</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Amit Kumar</p>
                        <p className="text-xs text-gray-500">Nov 8, 2024 11:20 AM</p>
                      </div>
                    </div>
                    <span className="badge bg-gray-100 text-gray-800 text-xs">Internal</span>
                  </div>
                  <p className="text-sm text-gray-700 ml-11">
                    Application assigned. All documents look good. Proceeding with verification.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

