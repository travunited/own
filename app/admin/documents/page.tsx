'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import DocumentVerificationPanel from '@/components/documents/DocumentVerificationPanel';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents/pending?status=${statusFilter}`);
      const data = await response.json();

      if (response.ok) {
        setDocuments(data.documents || []);
        if (data.documents?.length > 0 && !selectedDocument) {
          setSelectedDocument(data.documents[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });

      if (response.ok) {
        // Remove from list and select next
        const filtered = documents.filter(d => d.id !== selectedDocument.id);
        setDocuments(filtered);
        setSelectedDocument(filtered[0] || null);
      }
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', reason }),
      });

      if (response.ok) {
        const filtered = documents.filter(d => d.id !== selectedDocument.id);
        setDocuments(filtered);
        setSelectedDocument(filtered[0] || null);
      }
    } catch (error) {
      console.error('Reject error:', error);
    }
  };

  const handleRequestReupload = async (notes: string) => {
    if (!selectedDocument) return;

    try {
      const response = await fetch(`/api/documents/${selectedDocument.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_reupload', notes }),
      });

      if (response.ok) {
        const filtered = documents.filter(d => d.id !== selectedDocument.id);
        setDocuments(filtered);
        setSelectedDocument(filtered[0] || null);
      }
    } catch (error) {
      console.error('Request reupload error:', error);
    }
  };

  const handleNext = () => {
    const currentIndex = documents.findIndex(d => d.id === selectedDocument?.id);
    if (currentIndex < documents.length - 1) {
      setSelectedDocument(documents[currentIndex + 1]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'reupload_required':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.application?.application_number?.toLowerCase().includes(searchLower) ||
      doc.document_name?.toLowerCase().includes(searchLower) ||
      doc.traveler?.first_name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Verification</h1>
          <p className="text-gray-600 mt-2">Review and verify uploaded visa documents</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-3">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documents.filter(d => d.verification_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg mr-3">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg mr-3">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reupload Needed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Document Queue */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {['pending', 'verified', 'rejected', 'reupload_required'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p>No documents found</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedDocument?.id === doc.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(doc.verification_status)}
                          <span className="ml-2 font-medium text-gray-900 text-sm">
                            {doc.document_name}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        {doc.application?.application_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        {doc.traveler?.first_name} {doc.traveler?.last_name}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Verification Panel */}
          <div className="col-span-2">
            {selectedDocument ? (
              <DocumentVerificationPanel
                document={{
                  id: selectedDocument.id,
                  name: selectedDocument.document_name,
                  type: selectedDocument.file_mime_type,
                  url: selectedDocument.file_url,
                  size: selectedDocument.file_size,
                  uploadedAt: new Date(selectedDocument.uploaded_at),
                  travelerName: `${selectedDocument.traveler?.first_name || ''} ${selectedDocument.traveler?.last_name || ''}`,
                  applicationNumber: selectedDocument.application?.application_number || '',
                  verificationStatus: selectedDocument.verification_status,
                }}
                onApprove={handleApprove}
                onReject={handleReject}
                onRequestReupload={handleRequestReupload}
                onNext={handleNext}
                queueCount={documents.length}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Select a document to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

