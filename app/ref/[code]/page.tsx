'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Gift, CheckCircle, Users, Star, TrendingUp, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function ReferralLandingPage({ params }: PageProps) {
  const router = useRouter();
  const [referralCode, setReferralCode] = useState('');
  const [referrerName, setReferrerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const resolvedParams = await params;
      setReferralCode(resolvedParams.code);
      await claimReferral(resolvedParams.code);
    };
    initialize();
  }, []);

  const claimReferral = async (code: string) => {
    try {
      const response = await fetch('/api/referrals/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referralCode: code,
          source: document.referrer || 'direct',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReferrerName(data.referrer?.name || 'A friend');
        setClaimed(true);
        
        // Store in localStorage for signup attribution
        localStorage.setItem('referralCode', code);
        localStorage.setItem('referralDiscount', '500');
      }
    } catch (error) {
      console.error('Error claiming referral:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your special offer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-xl">
            <Gift className="w-12 h-12 text-primary-600" />
          </div>

          <h1 className="text-5xl font-bold mb-4">
            {referrerName} invited you to Travunited! 🎉
          </h1>
          <p className="text-2xl text-primary-100 mb-8 max-w-2xl mx-auto">
            You've been gifted a special welcome offer
          </p>

          {/* Discount Badge */}
          <div className="inline-block bg-white text-primary-600 rounded-2xl px-12 py-8 shadow-2xl mb-8">
            <p className="text-lg font-semibold mb-2">Your Special Discount</p>
            <p className="text-6xl font-bold">₹500 OFF</p>
            <p className="text-sm text-gray-600 mt-2">On your first visa or tour booking</p>
          </div>

          {/* Referral Code Display */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 inline-block mb-8">
            <p className="text-sm text-white/80 mb-1">Your Referral Code</p>
            <p className="text-2xl font-bold">{referralCode}</p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/signup')}
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-xl flex items-center justify-center"
            >
              Create Account & Get ₹500
              <ArrowRight className="w-6 h-6 ml-2" />
            </button>
            <button
              onClick={() => router.push('/visas')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all flex items-center justify-center"
            >
              Browse Visas
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Why Join Travunited?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Applications</h3>
              <p className="text-gray-600">
                Apply for visas in minutes with our simple, guided process
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-gray-600">
                Get your visa approved in 2-3 days with our expedited service
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted by Thousands</h3>
              <p className="text-gray-600">
                5M+ visas processed with 4.9★ rating from happy customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl p-12 text-center border border-primary-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join {referrerName} and thousands of others
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Start your travel journey with Travunited today and get ₹500 off your first booking
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <p className="text-4xl font-bold text-primary-600">5M+</p>
                <p className="text-gray-600">Visas Processed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-600">4.9★</p>
                <p className="text-gray-600">Customer Rating</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary-600">50+</p>
                <p className="text-gray-600">Countries Covered</p>
              </div>
            </div>

            <button
              onClick={() => router.push('/signup')}
              className="btn-primary text-lg px-10 py-4 shadow-xl"
            >
              Claim Your ₹500 Discount →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            How to Get Your ₹500 Discount
          </h2>

          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your Account</h3>
                <p className="text-gray-600">
                  Sign up with your email. Your ₹500 discount will be automatically applied with code: <strong>{referralCode}</strong>
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Choose Your Visa or Tour</h3>
                <p className="text-gray-600">
                  Browse our 50+ visa options or amazing tour packages and select what you need
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Booking</h3>
                <p className="text-gray-600">
                  Fill in details, upload documents, and make payment. Your ₹500 discount will be applied automatically!
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bonus: Refer Your Friends Too!</h3>
                <p className="text-gray-600">
                  Get your own referral code and earn ₹500 for every friend who books with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Save ₹500 on Your Next Trip?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join now and start your hassle-free visa journey
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-primary-600 hover:bg-primary-50 font-bold text-xl px-12 py-5 rounded-xl transition-all shadow-2xl"
          >
            Create Account Now →
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

