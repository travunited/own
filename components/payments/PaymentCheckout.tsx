'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CreditCard } from 'lucide-react';
import PricingBreakdown from './PricingBreakdown';
import { openRazorpayCheckout, RazorpaySuccessResponse } from '@/lib/payments/razorpay-client';
import { calculateApplicationPricing, PricingDetails } from '@/lib/payments/pricing';

interface PaymentCheckoutProps {
  applicationId: string;
  applicationNumber: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: Error) => void;
}

export default function PaymentCheckout({
  applicationId,
  applicationNumber,
  onSuccess,
  onFailure,
}: PaymentCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingDetails | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPricing();
  }, [applicationId]);

  const loadPricing = async () => {
    try {
      setLoadingPricing(true);
      const pricingData = await calculateApplicationPricing(applicationId);
      setPricing(pricingData);
    } catch (err: any) {
      setError(err.message || 'Failed to load pricing');
    } finally {
      setLoadingPricing(false);
    }
  };

  const handlePayment = async () => {
    if (!pricing) return;

    try {
      setLoading(true);
      setError(null);

      // 1. Create Razorpay order
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create payment order');
      }

      const { orderId, amount, currency, key } = await response.json();

      // 2. Open Razorpay checkout
      await openRazorpayCheckout({
        key,
        amount,
        currency,
        order_id: orderId,
        name: 'Travunited',
        description: `Visa Application - ${applicationNumber}`,
        image: '/logo.png',
        prefill: {
          name: '', // TODO: Get from user profile
          email: '', // TODO: Get from user profile
          contact: '', // TODO: Get from user profile
        },
        theme: {
          color: '#667eea',
        },
        handler: async (razorpayResponse: RazorpaySuccessResponse) => {
          // Payment successful
          await verifyPayment(razorpayResponse);
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      onFailure(err);
      setLoading(false);
    }
  };

  const verifyPayment = async (razorpayResponse: RazorpaySuccessResponse) => {
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(razorpayResponse),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const { paymentId } = await response.json();
      onSuccess(paymentId);
    } catch (err: any) {
      setError(err.message || 'Payment verification failed');
      onFailure(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPricing) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading payment details...</p>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-900 font-semibold mb-2">Failed to Load Payment Details</p>
        <p className="text-gray-600 mb-4">{error}</p>
        <button onClick={loadPricing} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Payment Error</h4>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <PricingBreakdown pricing={pricing} />

      {/* Payment Button */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-90">Total Amount Payable</p>
            <p className="text-3xl font-bold">
              ₹{pricing.total.toLocaleString('en-IN')}
            </p>
          </div>
          <CreditCard className="w-12 h-12 opacity-20" />
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-white text-primary-700 font-semibold py-4 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Payment
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center space-x-4 text-xs opacity-75">
          <span>🔒 Secure Payment</span>
          <span>•</span>
          <span>💳 All Cards Accepted</span>
          <span>•</span>
          <span>📱 UPI Supported</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Accepted Payment Methods</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
            <p className="text-xs text-gray-600">Credit/Debit Cards</p>
            <p className="text-lg">💳</p>
          </div>
          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
            <p className="text-xs text-gray-600">UPI</p>
            <p className="text-lg">📱</p>
          </div>
          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
            <p className="text-xs text-gray-600">Net Banking</p>
            <p className="text-lg">🏦</p>
          </div>
          <div className="bg-white p-3 rounded-lg text-center border border-gray-200">
            <p className="text-xs text-gray-600">Wallets</p>
            <p className="text-lg">💰</p>
          </div>
        </div>
      </div>
    </div>
  );
}

