'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    setResending(true);
    setError('');

    try {
      // TODO: Implement resend verification email API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setResent(true);
      setTimeout(() => setResent(false), 3000);
    } catch (err: any) {
      setError('Failed to resend verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-primary-600">
            Travunited
          </Link>
        </div>

        <div className="text-center">
          {/* Mail Icon */}
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 font-medium mb-2">What to do next:</p>
            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Look for an email from Travunited</li>
              <li>Click the verification link</li>
              <li>Return here to sign in</li>
            </ol>
          </div>

          {/* Success Message */}
          {resent && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <p className="text-sm text-green-600">Verification email sent!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={resending || resent}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {resending ? 'Sending...' : resent ? 'Email Sent!' : 'Resend Verification Email'}
          </button>

          {/* Help Text */}
          <p className="text-sm text-gray-600 mb-4">
            Didn't receive the email? Check your spam folder.
          </p>

          {/* Login Link */}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

