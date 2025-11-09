'use client';

import { AlertTriangle, X, Upload } from 'lucide-react';

interface MissingDocument {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
}

interface MissingDocumentsAlertProps {
  missingDocuments: MissingDocument[];
  onUploadClick: (documentId: string) => void;
  onDismiss?: () => void;
  canDismiss?: boolean;
}

export default function MissingDocumentsAlert({
  missingDocuments,
  onUploadClick,
  onDismiss,
  canDismiss = false,
}: MissingDocumentsAlertProps) {
  if (missingDocuments.length === 0) return null;

  const mandatoryCount = missingDocuments.filter(d => d.isMandatory).length;

  return (
    <div className="sticky top-0 z-40 bg-orange-50 border-l-4 border-orange-500 p-4 shadow-md animate-slide-in-down">
      <div className="flex items-start">
        <AlertTriangle className="w-6 h-6 text-orange-500 mr-3 flex-shrink-0 mt-0.5" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-orange-900">
              {mandatoryCount} {mandatoryCount === 1 ? 'Document' : 'Documents'} Required
            </h4>
            {canDismiss && onDismiss && (
              <button
                onClick={onDismiss}
                className="text-orange-700 hover:text-orange-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-orange-800 mb-3">
            Please upload the following documents to continue with your application:
          </p>

          <div className="space-y-2">
            {missingDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-200"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {doc.name}
                    {doc.isMandatory && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                        Required
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{doc.description}</p>
                </div>
                <button
                  onClick={() => onUploadClick(doc.id)}
                  className="ml-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload
                </button>
              </div>
            ))}
          </div>

          {mandatoryCount > 0 && (
            <div className="mt-3 p-3 bg-orange-100 rounded-lg">
              <p className="text-xs text-orange-800">
                ⚠️ <strong>Important:</strong> You cannot submit your application until all required documents are uploaded.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

