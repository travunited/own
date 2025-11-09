'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Upload,
  Download,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  CheckCircle,
  AlertCircle,
  Camera,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

export default function PhotoCreatorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedSpec, setSelectedSpec] = useState('india-passport');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoSpecs = [
    { id: 'india-passport', name: 'India Passport', size: '35x45mm', bg: 'White', dpi: 600 },
    { id: 'us-visa', name: 'US Visa', size: '2x2 inch', bg: 'White', dpi: 600 },
    { id: 'schengen', name: 'Schengen Visa', size: '35x45mm', bg: 'Light Gray', dpi: 600 },
    { id: 'uk-visa', name: 'UK Visa', size: '45x35mm', bg: 'Light Gray', dpi: 600 },
    { id: 'dubai-visa', name: 'Dubai Visa', size: '43x55mm', bg: 'White', dpi: 600 },
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) return;
    
    setProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would call an API to:
    // 1. Remove background
    // 2. Crop to correct dimensions
    // 3. Center face
    // 4. Adjust brightness/contrast
    // 5. Add correct background color
    
    setProcessedImage(selectedImage); // For now, use same image
    setProcessing(false);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `visa-photo-${selectedSpec}-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-12">
        <div className="container-custom">
          {/* Back Link */}
          <Link
            href="/tools"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Visa Photo Creator
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Create perfect visa photos with correct size, background, and specifications
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Specification Selector */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Select Photo Specification</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {photoSpecs.map((spec) => (
                      <button
                        key={spec.id}
                        onClick={() => setSelectedSpec(spec.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedSpec === spec.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900 text-sm">{spec.name}</p>
                        <p className="text-xs text-gray-600 mt-1">{spec.size}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Area */}
                {!selectedImage ? (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Upload Your Photo</h3>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-primary-400 transition-colors"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG or JPEG (max 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Face the camera directly</li>
                        <li>• Use good lighting</li>
                        <li>• Keep neutral expression</li>
                        <li>• Remove glasses and accessories</li>
                        <li>• Plain background (will be replaced)</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Preview & Process</h3>
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setProcessedImage(null);
                        }}
                        className="text-sm text-gray-600 hover:text-gray-900"
                      >
                        Upload Different Photo
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Original */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Original Photo</p>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={selectedImage}
                            alt="Original"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>

                      {/* Processed */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {processedImage ? 'Processed Photo' : 'Preview'}
                        </p>
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                          {processedImage ? (
                            <img
                              src={processedImage}
                              alt="Processed"
                              className="w-full h-auto"
                            />
                          ) : (
                            <div className="aspect-square flex items-center justify-center text-gray-400">
                              <Camera className="w-12 h-12" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                      {!processedImage ? (
                        <button
                          onClick={handleProcess}
                          disabled={processing}
                          className="flex-1 btn-primary disabled:opacity-50"
                        >
                          {processing ? 'Processing...' : 'Process Photo'}
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handleDownload}
                            className="flex-1 btn-primary"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            Download Photo
                          </button>
                          <button
                            onClick={handleProcess}
                            className="btn-outline"
                          >
                            <RotateCw className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Selected Spec Info */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Photo Specifications</h3>
                  {selectedSpec && photoSpecs.find(s => s.id === selectedSpec) && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium text-gray-900">
                          {photoSpecs.find(s => s.id === selectedSpec)?.size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Background:</span>
                        <span className="font-medium text-gray-900">
                          {photoSpecs.find(s => s.id === selectedSpec)?.bg}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-medium text-gray-900">
                          {photoSpecs.find(s => s.id === selectedSpec)?.dpi} DPI
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guidelines */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <div className="flex items-start mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">Photo Guidelines</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>✓ Face clearly visible</li>
                        <li>✓ Neutral expression</li>
                        <li>✓ Eyes open</li>
                        <li>✓ No glasses</li>
                        <li>✓ Plain background</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* What We Do */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What We Do</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Remove background</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Add correct background color</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Crop to exact dimensions</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Center and align face</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Optimize for printing</span>
                    </div>
                  </div>
                </div>

                {/* Help */}
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Not sure about photo requirements? Contact our support team.
                  </p>
                  <Link href="/contact" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Contact Support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

