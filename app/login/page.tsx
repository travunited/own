'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Shield, User as UserIcon } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import MFAInput from '@/components/auth/MFAInput';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requireMFA, setRequireMFA] = useState(false);
  const [tempUserId, setTempUserId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Sign in with email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Login failed');
      }

      // Step 2: Check if user has MFA enabled
      const { data: mfaData } = await supabase
        .from('user_mfa')
        .select('enabled')
        .eq('user_id', authData.user.id)
        .single();

      if (mfaData?.enabled) {
        // Require MFA code
        setRequireMFA(true);
        setTempUserId(authData.user.id);
        setLoading(false);
        return;
      }

      // Step 3: Get user role and redirect
      await handleSuccessfulLogin(authData.user.id);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleMFAVerification = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      // Verify MFA code
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid MFA code');
      }

      // Login successful with MFA
      await handleSuccessfulLogin(tempUserId!);
    } catch (err: any) {
      setError(err.message || 'MFA verification failed');
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = async (userId: string) => {
    try {
      // Get user role
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, preferences')
        .eq('id', userId)
        .single();

      const role = profile?.role || profile?.preferences?.role || 'user';

      // Redirect based on role
      const redirectRoutes: Record<string, string> = {
        super_admin: '/super-admin',
        admin: '/admin',
        sub_admin: '/admin',
        regional_admin: '/regional-admin',
        maintenance_admin: '/maintenance',
        user: '/dashboard',
      };

      const redirectTo = redirectRoutes[role] || '/dashboard';
      router.push(redirectTo);
    } catch (err: any) {
      console.error('Error getting user role:', err);
      // Default to user dashboard
      router.push('/dashboard');
    }
  };

  if (requireMFA) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Two-Factor Authentication
              </h2>
              <p className="text-gray-600">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <MFAInput
              length={6}
              value={mfaCode}
              onChange={setMfaCode}
              onComplete={handleMFAVerification}
              disabled={loading}
            />

            <button
              onClick={() => {
                setRequireMFA(false);
                setTempUserId(null);
                setError('');
              }}
              className="w-full mt-4 text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Role Badges Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2 font-medium">
              Login redirects to:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-red-600" />
                <span>Super Admin → /super-admin</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-purple-600" />
                <span>Admin → /admin</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-600" />
                <span>Regional → /regional-admin</span>
              </div>
              <div className="flex items-center gap-1">
                <UserIcon className="w-3 h-3 text-gray-600" />
                <span>User → /dashboard</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Signup Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Create account
            </Link>
          </p>
        </div>

        {/* Admin Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🔐 Admin credentials: travunited3@gmail.com / Marigudi@9
          </p>
        </div>
      </div>
    </div>
  );
}
