'use client';

import { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReferralBanner() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [referrerName, setReferrerName] = useState('');

  useEffect(() => {
    // Check if there's a referral code in localStorage
    const code = localStorage.getItem('referralCode');
    const discountAmount = localStorage.getItem('referralDiscount');

    if (code && discountAmount) {
      setDiscount(parseInt(discountAmount));
      setShow(true);
      
      // Optionally fetch referrer name
      // This could be stored in localStorage or fetched from API
    }
  }, []);

  const dismiss = () => {
    setShow(false);
  };

  if (!show || discount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <div className="bg-gradient-to-br from-primary-600 to-purple-600 text-white rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <Gift className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Your ₹{discount} Discount is Active!</h3>
            <p className="text-primary-100 text-sm mb-3">
              {referrerName && `From ${referrerName}'s referral. `}
              Discount will be applied at checkout
            </p>
            <button
              onClick={() => router.push('/visas')}
              className="bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Start Booking →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

