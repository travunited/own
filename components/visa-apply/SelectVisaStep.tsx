'use client';

import { useState } from 'react';
import { MapPin, Clock, DollarSign, Info, CheckCircle } from 'lucide-react';

interface SelectVisaStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SelectVisaStep({ data, onUpdate, onNext }: SelectVisaStepProps) {
  const [selectedCountry, setSelectedCountry] = useState(data.country || '');
  const [selectedVisaType, setSelectedVisaType] = useState(data.visaType || '');
  const [processingType, setProcessingType] = useState(data.processingType || 'STANDARD');

  const countries = [
    { code: 'ae', name: 'United Arab Emirates (Dubai)', flag: '🇦🇪' },
    { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
    { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'eu', name: 'Schengen (Europe)', flag: '🇪🇺' },
    { code: 'th', name: 'Thailand', flag: '🇹🇭' },
    { code: 'my', name: 'Malaysia', flag: '🇲🇾' },
  ];

  const visaTypes = {
    ae: [
      {
        id: 'tourist-30',
        name: 'Tourist Visa - 30 Days',
        price: 5499,
        processing: 2,
        validity: 60,
        stay: 30,
      },
      {
        id: 'tourist-90',
        name: 'Tourist Visa - 90 Days',
        price: 8999,
        processing: 3,
        validity: 60,
        stay: 90,
      },
      {
        id: 'business',
        name: 'Business Visa',
        price: 7999,
        processing: 3,
        validity: 90,
        stay: 30,
      },
    ],
    sg: [
      {
        id: 'tourist',
        name: 'Tourist Visa',
        price: 3999,
        processing: 4,
        validity: 90,
        stay: 30,
      },
    ],
    // Add more countries...
  };

  const currentVisaTypes = selectedCountry ? visaTypes[selectedCountry as keyof typeof visaTypes] || [] : [];
  const selectedVisa = currentVisaTypes.find((v) => v.id === selectedVisaType);

  const handleContinue = () => {
    if (selectedCountry && selectedVisaType) {
      onUpdate({
        ...data,
        country: selectedCountry,
        visaType: selectedVisaType,
        processingType,
        basePrice: selectedVisa?.price || 0,
      });
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Visa Details</h2>

        {/* Country Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Country *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  setSelectedCountry(country.code);
                  setSelectedVisaType('');
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedCountry === country.code
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-3xl mr-3">{country.flag}</span>
                  <span className="font-medium text-gray-900">{country.name}</span>
                  {selectedCountry === country.code && (
                    <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Visa Type Selection */}
        {selectedCountry && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Visa Type *
            </label>
            <div className="space-y-3">
              {currentVisaTypes.map((visa) => (
                <button
                  key={visa.id}
                  onClick={() => setSelectedVisaType(visa.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedVisaType === visa.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{visa.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Processing: {visa.processing} days</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          <span>Stay: {visa.stay} days</span>
                        </div>
                        <div className="flex items-center">
                          <Info className="w-4 h-4 mr-2" />
                          <span>Validity: {visa.validity} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        ₹{visa.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-600">per person</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Processing Type */}
        {selectedVisa && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Processing Type
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setProcessingType('STANDARD')}
                className={`p-4 border-2 rounded-lg text-left ${
                  processingType === 'STANDARD'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Standard</h3>
                  <span className="badge bg-gray-100 text-gray-800">Included</span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedVisa.processing} business days processing
                </p>
              </button>
              <button
                onClick={() => setProcessingType('EXPRESS')}
                className={`p-4 border-2 rounded-lg text-left ${
                  processingType === 'EXPRESS'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Express</h3>
                  <span className="badge bg-orange-100 text-orange-800">+ ₹2,000</span>
                </div>
                <p className="text-sm text-gray-600">
                  {Math.max(1, selectedVisa.processing - 1)} business day processing
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        {selectedVisa && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">What you'll need:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Passport (valid for at least 6 months)</li>
                  <li>Passport-sized photograph</li>
                  <li>Flight tickets (can be tentative)</li>
                  <li>Hotel booking confirmation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={() => window.history.back()} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedCountry || !selectedVisaType}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Travellers
        </button>
      </div>
    </div>
  );
}

