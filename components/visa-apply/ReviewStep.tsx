'use client';

import React from 'react';
import Link from 'next/link';
import { Edit, User, FileText, CreditCard, MapPin, Calendar, CheckCircle, Shield, Zap, FileCheck, Headphones, Camera, Truck } from 'lucide-react';

interface ReviewStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const iconMap: Record<string, any> = {
  Shield,
  Zap,
  FileCheck,
  Headphones,
  Camera,
  Truck,
};

export default function ReviewStep({ data, onUpdate, onNext, onBack }: ReviewStepProps) {
  const travellers = data.travellers || [];
  const documents = data.documents || {};
  const addonDetails = data.addon_details || [];

  const totalAmount = (data.base_price || 0) + (data.service_charge || 0) + (data.processing_charge || 0) + (data.addons_charge || 0);

  const documentsList = Object.values(documents);

  const goToStep = (step: number) => {
    // You can implement navigation back to specific step here
    alert('Edit functionality - navigate back to step ' + step);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Application</h2>
        <p className="text-gray-600 mb-6">
          Please review all details before proceeding to payment
        </p>

        {/* Visa Details */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Visa Details
            </h3>
            <button onClick={() => goToStep(1)} className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Destination</p>
              <p className="font-medium text-gray-900">{data.country_name || 'Not selected'}</p>
            </div>
            <div>
              <p className="text-gray-600">Visa Type</p>
              <p className="font-medium text-gray-900">{data.visa_type_name || 'Not selected'}</p>
            </div>
            <div>
              <p className="text-gray-600">Processing Type</p>
              <p className="font-medium text-gray-900">
                {data.processing_type === 'EXPRESS' ? 'Express Processing' : 'Standard Processing'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Application Number</p>
              <p className="font-mono font-medium text-primary-600">{data.application_number || 'Will be generated'}</p>
            </div>
          </div>
        </div>

        {/* Travellers */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
              <User className="w-5 h-5 mr-2 text-primary-600" />
              Travellers ({travellers.length})
            </h3>
            <button onClick={() => goToStep(2)} className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>

          <div className="space-y-4">
            {travellers.map((traveller: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">
                  {traveller.full_name}
                  {traveller.is_lead_traveller && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 text-primary-800">
                      Lead Traveller
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">DOB:</span> {traveller.date_of_birth}
                  </div>
                  <div>
                    <span className="font-medium">Gender:</span> {traveller.gender}
                  </div>
                  <div>
                    <span className="font-medium">Passport:</span> {traveller.passport_number}
                  </div>
                  <div>
                    <span className="font-medium">Expiry:</span> {traveller.passport_expiry}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary-600" />
              Documents ({documentsList.length} uploaded)
            </h3>
            <button onClick={() => goToStep(3)} className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentsList.map((doc: any, index: number) => (
              <div key={index} className="flex items-center bg-green-50 border border-green-200 rounded-lg p-3">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                  <p className="text-xs text-gray-600">{(doc.file_size / 1024).toFixed(0)} KB</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        {addonDetails.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-900">Selected Add-ons</h3>
              <button onClick={() => goToStep(4)} className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="space-y-2">
              {addonDetails.map((addon: any) => {
                const IconComponent = iconMap[addon.icon] || FileCheck;
                return (
                  <div key={addon.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-3">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{addon.name}</p>
                        <p className="text-xs text-gray-600">{addon.description}</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary-600">
                      ₹{(addon.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Visa Fee</span>
              <span className="font-medium">₹{(data.base_price || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Charge</span>
              <span className="font-medium">₹{(data.service_charge || 0).toLocaleString('en-IN')}</span>
            </div>
            {data.processing_charge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Express Processing</span>
                <span className="font-medium">₹{(data.processing_charge || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            {data.addons_charge > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Add-ons ({addonDetails.length})</span>
                <span className="font-medium">₹{(data.addons_charge || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t-2 border-primary-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900 text-lg">Total Amount</span>
              <span className="font-bold text-primary-600 text-2xl">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            * Amount will be charged per traveller: ₹{totalAmount.toLocaleString('en-IN')} × {travellers.length} = ₹{(totalAmount * travellers.length).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-6">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">
              I confirm that all information provided is accurate and I have read and agree to the{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                Privacy Policy
              </Link>
            </span>
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-outline px-8">
          Back
        </button>
        <button onClick={handleContinue} className="btn-primary px-8">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
