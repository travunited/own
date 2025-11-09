'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Phone, User, Lock, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [signupMethod, setSignupMethod] = useState<'email' | 'phone'>('phone');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement OTP sending logic
    setOtpSent(true);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary-600">
            Travunited
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Create Account</h2>
          <p className="text-gray-600 mt-2">Join thousands of happy travelers</p>
        </div>

        {!otpSent ? (
          /* Signup Form */
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            {/* Signup Method Toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSignupMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  signupMethod === 'phone'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Phone className="w-4 h-4 inline mr-1" />
                Phone
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('email')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                  signupMethod === 'email'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </button>
            </div>

            {signupMethod === 'phone' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              Send OTP
            </button>
          </form>
        ) : (
          /* Verify OTP Form */
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="input-field pl-10"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                OTP sent to {signupMethod === 'phone' ? formData.phone : formData.email}
              </p>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center">
              Verify & Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="w-full text-center text-sm text-gray-600 hover:text-primary-600"
            >
              Change details
            </button>

            <button
              type="button"
              className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Resend OTP
            </button>
          </form>
        )}

        {!otpSent && (
          <>
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="btn-outline py-2">
                <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button className="btn-outline py-2">
                <svg className="w-5 h-5 mr-2 inline" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>
          </>
        )}

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

