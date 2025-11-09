'use client';

import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

interface DocumentPreviewModalProps {
  document: Document;
  documents?: Document[];
  currentIndex?: number;
  onClose: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canDelete?: boolean;
}

export default function DocumentPreviewModal({
  document,
  documents = [],
  currentIndex = 0,
  onClose,
  onDownload,
  onDelete,
  onNext,
  onPrevious,
  canDelete = true,
}: DocumentPreviewModalProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const isPDF = document.type === 'application/pdf' || document.name.toLowerCase().endsWith('.pdf');
  const isImage = document.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(document.name);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl max-h-screen p-4">
        {/* Header */}
        <div className="bg-white rounded-t-xl p-4 flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{document.name}</h3>
            <p className="text-sm text-gray-600">
              {formatFileSize(document.size)} • Uploaded {new Date(document.uploadedAt).toLocaleString()}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {isImage && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[4rem] text-center">{zoom}%</span>
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </>
            )}

            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
            )}

            {canDelete && onDelete && (
              <button
                onClick={onDelete}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-gray-100 h-[calc(100%-8rem)] overflow-auto flex items-center justify-center relative">
          {/* Navigation Arrows */}
          {documents.length > 1 && (
            <>
              {onPrevious && currentIndex > 0 && (
                <button
                  onClick={onPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {onNext && currentIndex < documents.length - 1 && (
                <button
                  onClick={onNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </>
          )}

          {/* Document Display */}
          {isPDF ? (
            <iframe
              src={document.url}
              className="w-full h-full border-0"
              title={document.name}
            />
          ) : isImage ? (
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain transition-all"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            />
          ) : (
            <div className="text-center text-gray-600 p-8">
              <p className="mb-4">Preview not available for this file type</p>
              <button
                onClick={onDownload}
                className="btn-primary"
              >
                <Download className="w-5 h-5 mr-2" />
                Download to View
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {documents.length > 1 && (
          <div className="bg-white rounded-b-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Document {currentIndex + 1} of {documents.length}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

