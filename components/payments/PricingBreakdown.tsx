'use client';

import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/payments/pricing';

interface PricingBreakdownProps {
  pricing: {
    visaPrice: number;
    travelerCount: number;
    totalVisaPrice: number;
    addons: Array<{
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    addonsTotal: number;
    processingFee: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    currency: string;
  };
  showDetails?: boolean;
  className?: string;
}

export default function PricingBreakdown({
  pricing,
  showDetails = true,
  className = '',
}: PricingBreakdownProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Pricing Breakdown</h3>
        <p className="text-sm text-gray-600 mt-1">Detailed cost breakdown for your application</p>
      </div>

      {/* Items */}
      <div className="p-4 space-y-3">
        {/* Visa Price */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Visa Fee</p>
            <p className="text-xs text-gray-600">
              {formatCurrency(pricing.visaPrice)} × {pricing.travelerCount} traveler
              {pricing.travelerCount > 1 ? 's' : ''}
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(pricing.totalVisaPrice)}
          </p>
        </div>

        {/* Add-ons */}
        {pricing.addons.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Add-ons</p>
            {pricing.addons.map((addon, index) => (
              <div key={index} className="flex items-start justify-between ml-4">
                <div>
                  <p className="text-xs text-gray-700">{addon.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(addon.price)} × {addon.quantity}
                  </p>
                </div>
                <p className="text-sm text-gray-900">{formatCurrency(addon.total)}</p>
              </div>
            ))}
          </div>
        )}

        {/* Processing Fee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="text-sm text-gray-700">Processing Fee</p>
            <div className="group relative ml-1">
              <Info className="w-3 h-3 text-gray-400 cursor-help" />
              <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                3% processing fee for secure payment handling
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-900">{formatCurrency(pricing.processingFee)}</p>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Subtotal</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatCurrency(pricing.subtotal)}
            </p>
          </div>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">GST ({(pricing.taxRate * 100).toFixed(0)}%)</p>
          <p className="text-sm text-gray-900">{formatCurrency(pricing.taxAmount)}</p>
        </div>

        {/* Discount */}
        {pricing.discountAmount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <p className="text-sm font-medium">Discount</p>
            <p className="text-sm font-semibold">-{formatCurrency(pricing.discountAmount)}</p>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">Total Amount</p>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(pricing.total)}
          </p>
        </div>
        <p className="text-xs text-gray-600 mt-1">Inclusive of all taxes</p>
      </div>
    </div>
  );
}

