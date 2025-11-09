'use client';

import { useState } from 'react';
import { Check, X, RotateCw, Download, ZoomIn, ZoomOut, AlertCircle, FileText, User, Calendar } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
  travelerName: string;
  applicationNumber: string;
  verificationStatus: string;
  rejectionReason?: string;
}

interface DocumentVerificationPanelProps {
  document: Document;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onRequestReupload: (notes: string) => Promise<void>;
  onNext?: () => void;
  queueCount?: number;
}

export default function DocumentVerificationPanel({
  document,
  onApprove,
  onReject,
  onRequestReupload,
  onNext,
  queueCount = 0,
}: DocumentVerificationPanelProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);

  const isPDF = document.type === 'application/pdf';
  const isImage = document.type.startsWith('image/');

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove();
      if (onNext) onNext();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await onReject(rejectionReason);
      setShowRejectForm(false);
      setRejectionReason('');
      if (onNext) onNext();
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReupload = async () => {
    if (!adminNotes.trim()) {
      alert('Please provide notes for reupload request');
      return;
    }

    setLoading(true);
    try {
      await onRequestReupload(adminNotes);
      setAdminNotes('');
      if (onNext) onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Document Verification</h2>
          {queueCount > 0 && (
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
              {queueCount} in queue
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-600">Application</p>
              <p className="font-semibold text-gray-900">{document.applicationNumber}</p>
            </div>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-600">Traveler</p>
              <p className="font-semibold text-gray-900">{document.travelerName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-600">Uploaded</p>
              <p className="font-semibold text-gray-900">
                {new Date(document.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-gray-50 p-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Zoom Controls */}
          {isImage && (
            <div className="bg-gray-100 px-4 py-2 flex items-center justify-center gap-4">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700 font-medium">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="border-l border-gray-300 h-6 mx-2"></div>
              <button
                onClick={handleRotate}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Document Display */}
          <div className="min-h-[500px] flex items-center justify-center bg-gray-50">
            {isPDF ? (
              <iframe
                src={document.url}
                className="w-full h-[600px] border-0"
                title={document.name}
              />
            ) : isImage ? (
              <img
                src={document.url}
                alt={document.name}
                className="max-w-full transition-transform"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  maxHeight: '600px',
                }}
              />
            ) : (
              <div className="text-center p-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Preview not available</p>
                <a
                  href={document.url}
                  download
                  className="btn-primary inline-flex items-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download to View
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Requirement Checklist */}
        <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Verification Checklist</h4>
          <div className="space-y-2 text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Document is clear and readable</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">All corners/edges are visible</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Information matches application</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">Document is valid and not expired</span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-gray-200">
        {!showRejectForm ? (
          <>
            {/* Admin Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Add notes about this document..."
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleApprove}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <Check className="w-5 h-5 mr-2" />
                Approve
              </button>
              
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 mr-2" />
                Reject
              </button>
              
              <button
                onClick={handleRequestReupload}
                disabled={loading || !adminNotes.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
              >
                <RotateCw className="w-5 h-5 mr-2" />
                Request Reupload
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Rejection Form */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="input-field"
                rows={4}
                placeholder="Please provide a clear reason for rejection..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={loading || !rejectionReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectForm(false);
                  setRejectionReason('');
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Next Document Button */}
        {onNext && queueCount > 1 && (
          <button
            onClick={onNext}
            className="w-full mt-3 btn-outline"
          >
            Skip to Next Document ({queueCount - 1} remaining)
          </button>
        )}
      </div>
    </div>
  );
}

