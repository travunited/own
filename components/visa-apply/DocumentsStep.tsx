'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Eye, Download } from 'lucide-react';

interface DocumentsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
  format: string;
  maxSize: string;
  perTraveller: boolean;
}

export default function DocumentsStep({ data, onUpdate, onNext, onBack }: DocumentsStepProps) {
  const requiredDocuments: DocumentRequirement[] = [
    {
      id: 'passport',
      name: 'Passport Copy',
      description: 'First and last page of passport (must be valid for 6+ months)',
      mandatory: true,
      format: 'PDF, JPG, PNG',
      maxSize: '5MB',
      perTraveller: true,
    },
    {
      id: 'photo',
      name: 'Passport Size Photo',
      description: 'White background, recent photo (35mm x 45mm)',
      mandatory: true,
      format: 'JPG, PNG',
      maxSize: '2MB',
      perTraveller: true,
    },
    {
      id: 'flight',
      name: 'Flight Tickets',
      description: 'Confirmed or tentative booking',
      mandatory: true,
      format: 'PDF, JPG, PNG',
      maxSize: '5MB',
      perTraveller: false,
    },
    {
      id: 'hotel',
      name: 'Hotel Booking',
      description: 'Confirmed accommodation details',
      mandatory: true,
      format: 'PDF, JPG, PNG',
      maxSize: '5MB',
      perTraveller: false,
    },
    {
      id: 'bank_statement',
      name: 'Bank Statement',
      description: 'Last 6 months statement',
      mandatory: false,
      format: 'PDF',
      maxSize: '10MB',
      perTraveller: false,
    },
    {
      id: 'employment_letter',
      name: 'Employment Letter',
      description: 'Letter from employer (if employed)',
      mandatory: false,
      format: 'PDF',
      maxSize: '5MB',
      perTraveller: false,
    },
  ];

  const [documents, setDocuments] = useState<any>(data.documents || {});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const travellers = data.travellers || [];

  const handleFileSelect = async (docId: string, travellerIndex: number | null, file: File) => {
    const key = travellerIndex !== null ? `${docId}-${travellerIndex}` : docId;

    // Validate file
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setErrors({ ...errors, [key]: 'File size exceeds 10MB limit' });
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, [key]: 'Invalid file type. Please upload PDF, JPG, or PNG' });
      return;
    }

    // Clear error
    const newErrors = { ...errors };
    delete newErrors[key];
    setErrors(newErrors);

    // Start upload
    try {
      setUploadProgress({ ...uploadProgress, [key]: 0 });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', docId);
      if (travellerIndex !== null) {
        formData.append('traveler_id', travellers[travellerIndex]?.id || `traveler-${travellerIndex}`);
      }

      // Upload to backend
      const response = await fetch(`/api/visa-applications/${data.application_id}/upload-document`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Update progress to 100%
        setUploadProgress({ ...uploadProgress, [key]: 100 });

        // Store document info
        setDocuments((prev: any) => ({
          ...prev,
          [key]: {
            ...result.document,
            file_name: file.name,
            file_size: file.size,
            file_url: result.file_url,
            uploaded_at: new Date().toISOString(),
            status: 'UPLOADED',
          },
        }));

        // Clear progress after 2 seconds
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[key];
            return newProgress;
          });
        }, 2000);
      } else {
        setErrors({ ...errors, [key]: result.error || 'Upload failed' });
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[key];
          return newProgress;
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ ...errors, [key]: 'Upload failed. Please try again.' });
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[key];
        return newProgress;
      });
    }
  };

  const removeDocument = (key: string) => {
    const newDocuments = { ...documents };
    delete newDocuments[key];
    setDocuments(newDocuments);
  };

  const getMandatoryDocumentsStatus = () => {
    const mandatoryDocs = requiredDocuments.filter(d => d.mandatory);
    let uploaded = 0;
    let required = 0;

    mandatoryDocs.forEach(doc => {
      if (doc.perTraveller) {
        required += travellers.length;
        travellers.forEach((_t: any, index: number) => {
          const key = `${doc.id}-${index}`;
          if (documents[key]) uploaded++;
        });
      } else {
        required += 1;
        if (documents[doc.id]) uploaded++;
      }
    });

    return { uploaded, required };
  };

  const handleContinue = () => {
    const status = getMandatoryDocumentsStatus();
    
    if (status.uploaded < status.required) {
      alert(`Please upload all mandatory documents (${status.uploaded}/${status.required} uploaded)`);
      return;
    }

    onUpdate({ ...data, documents });
    onNext();
  };

  const mandatoryStatus = getMandatoryDocumentsStatus();

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
            <p className="text-gray-600">
              Upload clear, readable copies of all required documents
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {mandatoryStatus.uploaded}/{mandatoryStatus.required}
            </div>
            <div className="text-xs text-gray-600">Mandatory documents</div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-6">
          {requiredDocuments.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="font-bold text-gray-900">{doc.name}</h3>
                    {doc.mandatory && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Format: {doc.format}</span>
                    <span>Max Size: {doc.maxSize}</span>
                    {doc.perTraveller && (
                      <span className="text-primary-600 font-medium">Per Traveller</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload for each traveller or once */}
              {doc.perTraveller ? (
                <div className="space-y-3">
                  {travellers.map((traveller: any, index: number) => {
                    const key = `${doc.id}-${index}`;
                    const uploaded = documents[key];
                    const progress = uploadProgress[key];
                    const error = errors[key];

                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          For: {traveller.full_name || `Traveller ${index + 1}`}
                        </p>

                        {!uploaded && progress === undefined && (
                          <label className="btn-outline w-full cursor-pointer flex items-center justify-center">
                            <Upload className="w-4 h-4 mr-2" />
                            <span>Choose File</span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(doc.id, index, file);
                              }}
                            />
                          </label>
                        )}

                        {progress !== undefined && progress < 100 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Uploading...</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {uploaded && (
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center flex-1">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {uploaded.file_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {(uploaded.file_size / 1024).toFixed(0)} KB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <a
                                href={uploaded.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => removeDocument(key)}
                                className="text-red-600 hover:text-red-700"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {(() => {
                    const key = doc.id;
                    const uploaded = documents[key];
                    const progress = uploadProgress[key];
                    const error = errors[key];

                    return (
                      <>
                        {!uploaded && progress === undefined && (
                          <label className="btn-outline w-full cursor-pointer flex items-center justify-center">
                            <Upload className="w-4 h-4 mr-2" />
                            <span>Choose File</span>
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(doc.id, null, file);
                              }}
                            />
                          </label>
                        )}

                        {progress !== undefined && progress < 100 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Uploading...</span>
                              <span className="font-medium">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {uploaded && (
                          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center flex-1">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {uploaded.file_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {(uploaded.file_size / 1024).toFixed(0)} KB • Uploaded {new Date(uploaded.uploaded_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-3">
                              <a
                                href={uploaded.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => removeDocument(key)}
                                className="text-red-600 hover:text-red-700"
                                title="Remove"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-900 mb-1">Document Guidelines</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload clear, readable copies</li>
                <li>• Ensure all text is visible and not cut off</li>
                <li>• For photos: white background, no filters</li>
                <li>• Accepted formats: PDF, JPG, PNG</li>
                <li>• Maximum file size: 10MB per document</li>
                <li>• Documents are securely stored and encrypted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-outline px-8">
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={mandatoryStatus.uploaded < mandatoryStatus.required}
          className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Add-ons
        </button>
      </div>
    </div>
  );
}
