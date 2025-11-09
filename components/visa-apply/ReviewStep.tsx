'use client';

import { CheckCircle, Edit, MapPin, Users, Upload, FileText, DollarSign } from 'lucide-react';

interface ReviewStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ReviewStep({ data, onUpdate, onNext, onBack }: ReviewStepProps) {
  const countryNames: any = {
    ae: 'United Arab Emirates (Dubai)',
    sg: 'Singapore',
    gb: 'United Kingdom',
    th: 'Thailand',
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>

        {/* Visa Details */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary-600" />
              Visa Details
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Country</p>
              <p className="font-medium">{countryNames[data.country] || data.country}</p>
            </div>
            <div>
              <p className="text-gray-600">Visa Type</p>
              <p className="font-medium">{data.visaType}</p>
            </div>
            <div>
              <p className="text-gray-600">Processing Type</p>
              <p className="font-medium">
                {data.processingType === 'EXPRESS' ? 'Express' : 'Standard'}
              </p>
            </div>
          </div>
        </div>

        {/* Travellers */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary-600" />
              Travellers ({data.travellers?.length || 0})
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            {(data.travellers || []).map((traveller: any, index: number) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium">
                  {traveller.fullName}
                  {traveller.isLeadTraveller && (
                    <span className="ml-2 badge bg-primary-100 text-primary-800 text-xs">
                      Lead
                    </span>
                  )}
                </p>
                <div className="grid md:grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                  <p>DOB: {traveller.dateOfBirth}</p>
                  <p>Passport: {traveller.passportNumber}</p>
                  <p>Gender: {traveller.gender}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg flex items-center">
              <Upload className="w-5 h-5 mr-2 text-primary-600" />
              Documents
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              <Edit className="w-4 h-4 inline mr-1" />
              Edit
            </button>
          </div>
          <div className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            <p className="text-sm">All required documents uploaded successfully</p>
          </div>
        </div>

        {/* Add-ons */}
        {data.addons && data.addons.length > 0 && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                Add-on Services
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                <Edit className="w-4 h-4 inline mr-1" />
                Edit
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {data.addons.map((addon: string) => (
                <li key={addon} className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span className="capitalize">{addon.replace('-', ' ')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Final Amount */}
        <div className="bg-primary-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-primary-600">
                ₹{(data.totalAmount || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Including GST and all charges
              </p>
            </div>
            <DollarSign className="w-16 h-16 text-primary-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="card">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 mr-3"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            I have reviewed all the details and confirm that the information provided is accurate.
            I agree to the{' '}
            <a href="/terms" target="_blank" className="text-primary-600 hover:text-primary-700">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" target="_blank" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </a>
            .
          </label>
        </div>
      </div>

      {/* Important Notice */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="font-bold text-yellow-900 mb-2">Important Notice</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Visa approval is subject to embassy decision</li>
          <li>Processing time may vary based on embassy workload</li>
          <li>Service fees are non-refundable in case of rejection</li>
          <li>You will receive updates via email and SMS</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button onClick={onNext} className="btn-primary">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

