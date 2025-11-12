'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign in with email/password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Login failed');
      }

      // Get user role and redirect
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role, preferences')
        .eq('id', authData.user.id)
        .single();

      const role = profile?.role || profile?.preferences?.role || 'user';

      // Track session for admin users
      if (['super_admin', 'admin', 'sub_admin', 'regional_admin', 'maintenance_admin'].includes(role)) {
        const dashboardTypeMap: Record<string, string> = {
          super_admin: 'super-admin',
          admin: 'admin',
          sub_admin: 'admin',
          regional_admin: 'regional-admin',
          maintenance_admin: 'maintenance',
        };

        try {
          const sessionResponse = await fetch('/api/auth/track-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              dashboardType: dashboardTypeMap[role] || 'admin',
            }),
          });

          const sessionData = await sessionResponse.json();
          
          if (sessionData.success && sessionData.sessionToken) {
            // Store session token in localStorage for activity tracking
            localStorage.setItem('admin_session_token', sessionData.sessionToken);
          }
        } catch (err) {
          console.error('Error tracking session:', err);
          // Continue with login even if session tracking fails
        }
      }

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
      setError(err.message || 'Login failed. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold text-primary-600 mb-6 inline-block">
              Travunited
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in with your email and password
            </p>
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
                  autoComplete="email"
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
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
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

        {/* Test Credentials */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
          <p className="text-sm text-gray-700 font-medium mb-2 text-center">
            🔐 Test Accounts:
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Super Admin:</strong> travunited3@gmail.com / Marigudi@9</p>
            <p><strong>Admin:</strong> admin@travunited.com / Admin@123</p>
            <p><strong>User:</strong> Create your own account above</p>
          </div>
        </div>
      </div>
    </div>
  );
}
