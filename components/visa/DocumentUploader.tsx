'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploaderProps {
  documentName: string;
  documentDescription?: string;
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (fileId: string) => void;
  existingFiles?: Array<{
    id: string;
    name: string;
    size: number;
    url: string;
  }>;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedFormats?: string[];
}

export default function DocumentUploader({
  documentName,
  documentDescription,
  onUpload,
  onRemove,
  existingFiles = [],
  maxFiles = 5,
  maxSize = 5,
  acceptedFormats = ['application/pdf', 'image/jpeg', 'image/png'],
}: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError('');

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(f => f.errors[0]?.message).join(', ');
      setError(errors);
      return;
    }

    // Check total file count
    if (existingFiles.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await onUpload(acceptedFiles);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  }, [existingFiles, maxFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {}),
    maxSize: maxSize * 1024 * 1024,
    disabled: uploading || existingFiles.length >= maxFiles,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-gray-900 mb-1">{documentName}</h4>
        {documentDescription && (
          <p className="text-sm text-gray-600">{documentDescription}</p>
        )}
      </div>

      {/* Upload Area */}
      {existingFiles.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragActive ? 'text-primary-600' : 'text-gray-400'}`} />
          
          {uploading ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Uploading...</p>
              <div className="max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{uploadProgress}%</p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-xs text-gray-500 mb-3">or click to browse</p>
              <p className="text-xs text-gray-500">
                {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} • Max {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Uploaded Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploaded Files</p>
          {existingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center flex-1 min-w-0">
                <File className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center ml-3">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {onRemove && (
                  <button
                    onClick={() => onRemove(file.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

