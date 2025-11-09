'use client';

import { Users, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface SummarySidebarProps {
  visaType?: {
    name: string;
    country: string;
  };
  travelers: number;
  governmentFee: number;
  serviceFee: number;
  addonFees: number;
  completionPercentage: number;
  processingDays?: number;
}

export default function SummarySidebar({
  visaType,
  travelers,
  governmentFee,
  serviceFee,
  addonFees,
  completionPercentage,
  processingDays,
}: SummarySidebarProps) {
  const totalPerPerson = governmentFee + serviceFee;
  const grandTotal = (totalPerPerson * travelers) + addonFees;

  return (
    <div className="sticky top-24 space-y-4">
      {/* Application Progress */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Application Progress</h3>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Completion</span>
            <span className="font-semibold text-primary-600">{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {visaType && (
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <FileText className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-600">Visa Type</p>
                <p className="font-medium text-gray-900">{visaType.name}</p>
                <p className="text-xs text-gray-500">{visaType.country}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Users className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="text-gray-600">Travelers</p>
                <p className="font-medium text-gray-900">{travelers} {travelers === 1 ? 'Person' : 'People'}</p>
              </div>
            </div>

            {processingDays && (
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-600">Processing Time</p>
                  <p className="font-medium text-gray-900">{processingDays} Business Days</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pricing Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Pricing Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Government Fee</span>
            <span className="font-medium text-gray-900">
              ₹{(governmentFee * travelers).toLocaleString()}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium text-gray-900">
              ₹{(serviceFee * travelers).toLocaleString()}
            </span>
          </div>

          {travelers > 1 && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>× {travelers} travelers</span>
              <span>₹{totalPerPerson.toLocaleString()} each</span>
            </div>
          )}

          {addonFees > 0 && (
            <>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Add-on Services</span>
                  <span className="font-medium text-gray-900">
                    ₹{addonFees.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="border-t-2 border-gray-300 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="text-2xl font-bold text-primary-600">
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-green-700">
              All prices include taxes. No hidden charges.
            </p>
          </div>
        </div>
      </div>

      {/* Help Card */}
      <div className="bg-primary-50 rounded-xl p-6 border border-primary-100">
        <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
        <p className="text-sm text-gray-600 mb-3">
          Our visa experts are here to assist you 24/7
        </p>
        <button className="w-full text-sm bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
          Chat with Expert
        </button>
      </div>
    </div>
  );
}

