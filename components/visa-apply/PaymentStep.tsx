'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, Building, Wallet, CheckCircle, Lock } from 'lucide-react';

interface PaymentStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentStep({ data, onUpdate, onNext, onBack }: PaymentStepProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay via Google Pay, PhonePe, Paytm',
      icon: Smartphone,
      popular: true,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, Rupay',
      icon: CreditCard,
      popular: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: Building,
      popular: false,
    },
    {
      id: 'wallet',
      name: 'Wallets',
      description: 'Paytm, PhonePe, Amazon Pay',
      icon: Wallet,
      popular: false,
    },
  ];

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);

    // TODO: Integrate with Razorpay
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to success page
      router.push('/visa-apply/success?id=TRV' + Date.now());
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
        <p className="text-gray-600 mb-6">
          Choose your preferred payment method to complete the application
        </p>

        {/* Amount Summary */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl p-6 mb-6">
          <p className="text-sm opacity-90 mb-1">Total Amount</p>
          <p className="text-4xl font-bold mb-4">
            ₹{(data.totalAmount || 0).toLocaleString('en-IN')}
          </p>
          <div className="flex items-center text-sm opacity-90">
            <Lock className="w-4 h-4 mr-2" />
            <span>Secure payment powered by Razorpay</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Payment Method
          </label>
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethod === method.id;

            return (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                      isSelected ? 'bg-primary-600' : 'bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-gray-900">{method.name}</h3>
                      {method.popular && (
                        <span className="ml-2 badge bg-green-100 text-green-800 text-xs">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary-600 bg-primary-600' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <Lock className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-900">
              <p className="font-medium mb-1">Secure Payment</p>
              <p className="text-green-800">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="card bg-gray-50">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Application Fee</span>
            <span className="font-medium">
              ₹{((data.basePrice || 5499) * (data.travellers?.length || 1)).toLocaleString('en-IN')}
            </span>
          </div>
          {data.processingType === 'EXPRESS' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Express Processing</span>
              <span className="font-medium">
                ₹{(2000 * (data.travellers?.length || 1)).toLocaleString('en-IN')}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">₹500</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%)</span>
            <span className="font-medium">
              ₹{Math.round((data.totalAmount || 0) * 0.18).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary-600">
                ₹{(data.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary" disabled={isProcessing}>
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={!paymentMethod || isProcessing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isProcessing ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Processing...
            </>
          ) : (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay ₹{(data.totalAmount || 0).toLocaleString('en-IN')}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

