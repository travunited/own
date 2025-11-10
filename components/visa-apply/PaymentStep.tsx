'use client';

import { useState } from 'react';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PaymentStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentStep({ data, onUpdate, onNext, onBack }: PaymentStepProps) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const travellers = data.travellers || [];
  const totalPerTraveller = (data.base_price || 0) + (data.service_charge || 0) + (data.processing_charge || 0) + (data.addons_charge || 0);
  const grandTotal = totalPerTraveller * travellers.length;

  const initiatePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          currency: 'INR',
          applicationId: data.application_id,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // Step 2: Load Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: grandTotal * 100, // Amount in paise
        currency: 'INR',
        name: 'Travunited',
        description: `Visa Application - ${data.country_name}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Step 3: Verify payment
          await verifyPayment(response);
        },
        prefill: {
          name: travellers[0]?.full_name || '',
          email: '', // Get from user profile
          contact: '', // Get from user profile
        },
        notes: {
          application_id: data.application_id,
          application_number: data.application_number,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const verifyResponse = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          applicationId: data.application_id,
        }),
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // Update application status to 'submitted'
        await fetch(`/api/visa-applications/${data.application_id}/submit`, {
          method: 'POST',
        });

        // Redirect to success page
        router.push(`/visa-apply/success?app=${data.application_id}`);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setError('Payment verification failed. Please contact support.');
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-600 mb-6">
          Secure payment powered by Razorpay
        </p>

        {/* Payment Summary */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Final Amount</h3>
          
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Price per Traveller</span>
              <span className="font-medium">₹{totalPerTraveller.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Number of Travellers</span>
              <span className="font-medium">× {travellers.length}</span>
            </div>
            <div className="border-t-2 border-primary-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900 text-xl">Grand Total</span>
              <span className="font-bold text-primary-600 text-3xl">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 border border-gray-200 rounded-lg text-center">
              <CreditCard className="w-6 h-6 mx-auto mb-2 text-primary-600" />
              <p className="text-xs font-medium">Credit/Debit Card</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg text-center">
              <p className="text-lg mb-1">💳</p>
              <p className="text-xs font-medium">UPI</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg text-center">
              <p className="text-lg mb-1">🏦</p>
              <p className="text-xs font-medium">Net Banking</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg text-center">
              <p className="text-lg mb-1">💰</p>
              <p className="text-xs font-medium">Wallets</p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <p className="font-medium text-green-900 mb-1">100% Secure Payment</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Your payment information is encrypted and secure</li>
                <li>• We never store your card details</li>
                <li>• Powered by Razorpay - trusted by millions</li>
                <li>• PCI DSS compliant payment processing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 mb-1">Payment Error</p>
                <p className="text-sm text-red-800">{error}</p>
                <p className="text-xs text-red-700 mt-2">
                  If the problem persists, please contact support or try again later.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pay Button */}
        <button
          onClick={initiatePayment}
          disabled={processing}
          className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-6 h-6 mr-3" />
              Pay ₹{grandTotal.toLocaleString('en-IN')} Now
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          By proceeding, you agree to our refund and cancellation policy
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-outline px-8">
          Back to Review
        </button>
        <div></div>
      </div>
    </div>
  );
}
