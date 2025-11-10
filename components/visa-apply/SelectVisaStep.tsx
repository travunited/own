'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, DollarSign, Info, CheckCircle, Zap, RefreshCw } from 'lucide-react';

interface SelectVisaStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SelectVisaStep({ data, onUpdate, onNext }: SelectVisaStepProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [visaTypes, setVisaTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingVisaTypes, setLoadingVisaTypes] = useState(false);
  
  const [selectedCountry, setSelectedCountry] = useState(data.country_id || '');
  const [selectedVisaType, setSelectedVisaType] = useState(data.visa_type_id || '');
  const [processingType, setProcessingType] = useState(data.processing_type || 'STANDARD');

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      loadVisaTypes(selectedCountry);
    }
  }, [selectedCountry]);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/visa-apply/load-data');
      const result = await response.json();

      if (result.success) {
        setCountries(result.countries || []);
      } else {
        alert('Failed to load countries');
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      alert('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const loadVisaTypes = async (countryId: string) => {
    try {
      setLoadingVisaTypes(true);
      const response = await fetch(`/api/visa-apply/load-data?country_id=${countryId}`);
      const result = await response.json();

      if (result.success) {
        setVisaTypes(result.visaTypes || []);
      }
    } catch (error) {
      console.error('Error loading visa types:', error);
    } finally {
      setLoadingVisaTypes(false);
    }
  };

  const selectedCountryData = countries.find((c) => c.id === selectedCountry);
  const selectedVisaData = visaTypes.find((v) => v.id === selectedVisaType);

  const calculateTotalPrice = () => {
    if (!selectedVisaData) return 0;
    
    const basePrice = selectedVisaData.base_price || 0;
    const serviceCharge = selectedVisaData.service_charge || 0;
    const processingCharge = processingType === 'EXPRESS' 
      ? (selectedVisaData.express_charge || 0) 
      : 0;
    
    return basePrice + serviceCharge + processingCharge;
  };

  const handleContinue = () => {
    if (!selectedCountry || !selectedVisaType) {
      alert('Please select both country and visa type');
      return;
    }

    onUpdate({
      ...data,
      country_id: selectedCountry,
      visa_type_id: selectedVisaType,
      processing_type: processingType,
      base_price: selectedVisaData?.base_price || 0,
      service_charge: selectedVisaData?.service_charge || 0,
      processing_charge: processingType === 'EXPRESS' ? (selectedVisaData?.express_charge || 0) : 0,
      total_amount: calculateTotalPrice(),
      country_name: selectedCountryData?.name,
      visa_type_name: selectedVisaData?.name,
    });
    onNext();
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading visa options...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Visa Details</h2>
        <p className="text-gray-600 mb-6">Choose your destination and visa type</p>

        {/* Country Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Destination Country *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => {
                  setSelectedCountry(country.id);
                  setSelectedVisaType('');
                }}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                  selectedCountry === country.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{country.flag}</span>
                  {selectedCountry === country.id && (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  )}
                  {country.is_popular && (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{country.name}</h3>
                <p className="text-sm text-gray-600">{country.continent || ''}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Visa Type Selection */}
        {selectedCountry && (
          <div className="mb-8 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Visa Type *
            </label>
            
            {loadingVisaTypes ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading visa types...</p>
              </div>
            ) : visaTypes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No visa types available for this country</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {visaTypes.map((visa) => (
                  <button
                    key={visa.id}
                    onClick={() => setSelectedVisaType(visa.id)}
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                      selectedVisaType === visa.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{visa.name}</h3>
                          {selectedVisaType === visa.id && (
                            <CheckCircle className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{visa.description || ''}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{visa.processing_days || 0} days processing</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Info className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{visa.validity_days || 0} days validity</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-2 text-primary-600" />
                            <span>{visa.max_stay_days || 0} days stay</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-6">
                        <div className="text-2xl font-bold text-primary-600">
                          ₹{(visa.base_price || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          + ₹{(visa.service_charge || 0).toLocaleString('en-IN')} service
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Processing Type */}
        {selectedVisaType && (
          <div className="mb-8 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Processing Speed *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setProcessingType('STANDARD')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  processingType === 'STANDARD'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-primary-600 mr-2" />
                    <span className="font-bold text-gray-900">Standard</span>
                  </div>
                  {processingType === 'STANDARD' && (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedVisaData?.processing_days || 0} business days
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Included in visa price
                </p>
              </button>

              <button
                onClick={() => setProcessingType('EXPRESS')}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  processingType === 'EXPRESS'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="font-bold text-gray-900">Express</span>
                  </div>
                  {processingType === 'EXPRESS' && (
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {Math.ceil((selectedVisaData?.processing_days || 0) / 2)} business days
                </p>
                <p className="text-sm font-medium text-gray-900">
                  + ₹{(selectedVisaData?.express_charge || 0).toLocaleString('en-IN')}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Price Summary */}
        {selectedVisaType && (
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-6 animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-4">Price Breakdown</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Visa Fee</span>
                <span className="font-medium">₹{(selectedVisaData?.base_price || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Charge</span>
                <span className="font-medium">₹{(selectedVisaData?.service_charge || 0).toLocaleString('en-IN')}</span>
              </div>
              {processingType === 'EXPRESS' && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Express Processing</span>
                  <span className="font-medium">₹{(selectedVisaData?.express_charge || 0).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-primary-200 pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total Amount</span>
                <span className="font-bold text-primary-600 text-lg">
                  ₹{calculateTotalPrice().toLocaleString('en-IN')}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              * Final amount may vary based on add-ons and number of travelers
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <div></div>
        <button
          onClick={handleContinue}
          disabled={!selectedCountry || !selectedVisaType}
          className="btn-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Traveller Details
        </button>
      </div>
    </div>
  );
}
