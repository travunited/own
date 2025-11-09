'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface DocumentsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentsStep({ data, onUpdate, onNext, onBack }: DocumentsStepProps) {
  const requiredDocuments = [
    {
      id: 'passport',
      name: 'Passport Copy',
      description: 'First and last page of passport',
      mandatory: true,
      format: 'PDF, JPG, PNG',
      maxSize: '5MB',
    },
    {
      id: 'photo',
      name: 'Passport Size Photo',
      description: 'White background, recent photo',
      mandatory: true,
      format: 'JPG, PNG',
      maxSize: '2MB',
    },
    {
      id: 'flight',
      name: 'Flight Tickets',
      description: 'Confirmed or tentative booking',
      mandatory: true,
      format: 'PDF, JPG, PNG',
      maxSize: '5MB',
    },
    {
      id: 'hotel',
      name: 'Hotel Booking',
      description: 'Confirmed accommodation details',
      mandatory: true,
      format: 'PDF, JPG, PNG',
      maxSize: '5MB',
    },
    {
      id: 'bank',
      name: 'Bank Statement',
      description: 'Last 6 months statement',
      mandatory: false,
      format: 'PDF',
      maxSize: '10MB',
    },
  ];

  const [documents, setDocuments] = useState<any>(data.documents || {});
  const [uploadProgress, setUploadProgress] = useState<any>({});

  const handleFileSelect = (docId: string, travellerIndex: number, file: File) => {
    // Validate file
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      alert('File size exceeds maximum limit');
      return;
    }

    // Simulate upload
    setUploadProgress((prev: any) => ({
      ...prev,
      [`${docId}-${travellerIndex}`]: 0,
    }));

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev: any) => {
        const current = prev[`${docId}-${travellerIndex}`] || 0;
        if (current >= 100) {
          clearInterval(interval);
          return prev;
        }
        return {
          ...prev,
          [`${docId}-${travellerIndex}`]: current + 20,
        };
      });
    }, 200);

    // Store file reference
    setTimeout(() => {
      setDocuments((prev: any) => ({
        ...prev,
        [`${docId}-${travellerIndex}`]: {
          file,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          status: 'UPLOADED',
        },
      }));
    }, 1000);
  };

  const handleRemoveFile = (docId: string, travellerIndex: number) => {
    setDocuments((prev: any) => {
      const newDocs = { ...prev };
      delete newDocs[`${docId}-${travellerIndex}`];
      return newDocs;
    });
  };

  const handleContinue = () => {
    // Check if all mandatory documents are uploaded for all travellers
    const travellers = data.travellers || [];
    const mandatoryDocs = requiredDocuments.filter((doc) => doc.mandatory);
    
    let allUploaded = true;
    for (let i = 0; i < travellers.length; i++) {
      for (const doc of mandatoryDocs) {
        if (!documents[`${doc.id}-${i}`]) {
          allUploaded = false;
          break;
        }
      }
      if (!allUploaded) break;
    }

    if (!allUploaded) {
      alert('Please upload all mandatory documents for all travellers');
      return;
    }

    onUpdate({ ...data, documents });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
        <p className="text-gray-600 mb-6">
          Please upload documents for each traveller. All documents should be clear and readable.
        </p>

        {(data.travellers || []).map((traveller: any, travellerIndex: number) => (
          <div key={travellerIndex} className="mb-8 pb-8 border-b border-gray-200 last:border-0">
            <h3 className="font-bold text-lg text-gray-900 mb-4">
              {traveller.fullName || `Traveller ${travellerIndex + 1}`}
            </h3>

            <div className="space-y-4">
              {requiredDocuments.map((doc) => {
                const docKey = `${doc.id}-${travellerIndex}`;
                const uploadedDoc = documents[docKey];
                const progress = uploadProgress[docKey];

                return (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-medium text-gray-900">{doc.name}</h4>
                          {doc.mandatory && (
                            <span className="ml-2 text-xs text-red-600">*Required</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Format: {doc.format} | Max size: {doc.maxSize}
                        </p>
                      </div>
                    </div>

                    {!uploadedDoc ? (
                      <div>
                        {progress !== undefined && progress < 100 ? (
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Uploading... {progress}%</p>
                          </div>
                        ) : (
                          <label className="mt-3 btn-outline cursor-pointer inline-flex items-center">
                            <Upload className="w-4 h-4 mr-2" />
                            Choose File
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(doc.id, travellerIndex, file);
                              }}
                              accept={doc.format.toLowerCase().includes('pdf') ? '.pdf' : 'image/*'}
                            />
                          </label>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-green-900">
                              {uploadedDoc.name}
                            </p>
                            <p className="text-xs text-green-700">
                              {(uploadedDoc.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(doc.id, travellerIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-2">Important Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>All documents should be clear and readable</li>
              <li>Photos should have white background only</li>
              <li>Passport must be valid for at least 6 months</li>
              <li>Documents can be uploaded later from your dashboard</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={handleContinue} className="btn-primary">
          Continue to Add-ons
        </button>
      </div>
    </div>
  );
}

