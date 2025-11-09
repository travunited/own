'use client';

import { CheckCircle, Circle, AlertCircle, FileText } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  description: string;
  isMandatory: boolean;
  uploaded: boolean;
  verified?: boolean;
}

interface DocumentChecklistProps {
  documents: Document[];
  onUploadClick: (documentId: string) => void;
}

export default function DocumentChecklist({ documents, onUploadClick }: DocumentChecklistProps) {
  const mandatoryDocs = documents.filter(d => d.isMandatory);
  const optionalDocs = documents.filter(d => !d.isMandatory);
  const uploadedCount = documents.filter(d => d.uploaded).length;
  const totalCount = documents.length;

  const getDocumentIcon = (doc: Document) => {
    if (doc.uploaded) {
      if (doc.verified === false) {
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      }
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-300" />;
  };

  const getDocumentStatus = (doc: Document) => {
    if (doc.uploaded) {
      if (doc.verified === true) return 'Verified';
      if (doc.verified === false) return 'Review Required';
      return 'Uploaded';
    }
    return doc.isMandatory ? 'Required' : 'Optional';
  };

  const getStatusColor = (doc: Document) => {
    if (doc.uploaded) {
      if (doc.verified === true) return 'text-green-600';
      if (doc.verified === false) return 'text-yellow-600';
      return 'text-blue-600';
    }
    return doc.isMandatory ? 'text-red-600' : 'text-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Document Checklist</h3>
        <span className="text-sm text-gray-600">
          {uploadedCount} of {totalCount} uploaded
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
            style={{ width: `${(uploadedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Mandatory Documents */}
      {mandatoryDocs.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Required Documents</h4>
          <div className="space-y-3">
            {mandatoryDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onUploadClick(doc.id)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getDocumentIcon(doc)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {doc.description}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ml-2 ${getStatusColor(doc)}`}>
                        {getDocumentStatus(doc)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Optional Documents</h4>
          <div className="space-y-3">
            {optionalDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onUploadClick(doc.id)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getDocumentIcon(doc)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {doc.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {doc.description}
                        </p>
                      </div>
                      <span className={`text-xs font-medium ml-2 ${getStatusColor(doc)}`}>
                        {getDocumentStatus(doc)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <FileText className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Click on any document to upload. Accepted formats: PDF, JPG, PNG. Max size: 5MB per file.
          </p>
        </div>
      </div>
    </div>
  );
}

