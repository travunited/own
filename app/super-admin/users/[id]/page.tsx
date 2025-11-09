'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  Shield,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Ban,
  Unlock,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    phone: '',
    city: '',
    country: '',
    role: 'user',
  });

  useEffect(() => {
    const initialize = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.id);
      await loadUserData(resolvedParams.id);
    };
    initialize();
  }, []);

  const loadUserData = async (id: string) => {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) throw profileError;

      // Get user from auth
      const { data: authData } = await supabase.auth.admin.getUserById(id);

      // Get user statistics
      const [
        { count: applicationCount },
        { count: tourCount },
        { data: payments },
        { data: referrals },
        { data: activities },
      ] = await Promise.all([
        supabase.from('visa_applications').select('*', { count: 'exact', head: true }).eq('user_id', id),
        supabase.from('tour_bookings').select('*', { count: 'exact', head: true }).eq('user_id', id),
        supabase.from('payments').select('*').eq('user_id', id).eq('status', 'completed'),
        supabase.from('referrals').select('*').eq('referrer_id', id).eq('status', 'completed'),
        supabase.from('visa_applications').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(5),
      ]);

      const totalSpent = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      const referralEarnings = referrals?.reduce((sum, r) => sum + (r.referrer_reward || 0), 0) || 0;

      setUser({
        ...profile,
        email: authData?.user?.email,
        emailVerified: authData?.user?.email_confirmed_at ? true : false,
        lastSignIn: authData?.user?.last_sign_in_at,
        stats: {
          applications: applicationCount || 0,
          tours: tourCount || 0,
          totalSpent,
          referrals: referrals?.length || 0,
          referralEarnings,
        },
        recentActivity: activities || [],
      });

      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        phone: profile.phone || '',
        city: profile.city || '',
        country: profile.country || '',
        role: profile.role || 'user',
      });
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(formData)
        .eq('id', userId);

      if (error) throw error;

      alert('User updated successfully!');
      setEditing(false);
      await loadUserData(userId);
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!confirm('Are you sure you want to suspend this user?')) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      alert('User suspended successfully');
      await loadUserData(userId);
    } catch (error) {
      console.error('Error suspending user:', error);
      alert('Failed to suspend user');
    }
  };

  const handleActivate = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: true })
        .eq('id', userId);

      if (error) throw error;

      alert('User activated successfully');
      await loadUserData(userId);
    } catch (error) {
      console.error('Error activating user:', error);
      alert('Failed to activate user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <Link href="/super-admin/users" className="text-primary-600 hover:text-primary-700">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <Link
          href="/super-admin/users"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Users
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="btn-outline flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          full_name: user.full_name || '',
                          username: user.username || '',
                          phone: user.phone || '',
                          city: user.city || '',
                          country: user.country || '',
                          role: user.role || 'user',
                        });
                      }}
                      className="btn-outline"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.full_name || user.username}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        user.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Suspended'}
                    </span>
                    <span className="px-3 py-1 text-xs rounded-full font-medium bg-primary-100 text-primary-800">
                      {user.role?.replace('_', ' ')}
                    </span>
                    {user.emailVerified && (
                      <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.full_name || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.username || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {user.phone || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  {editing ? (
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="input-field"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="sub_admin">Sub Admin</option>
                      <option value="regional_admin">Regional Admin</option>
                      <option value="maintenance_admin">Maintenance Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      {user.role?.replace('_', ' ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {user.city || 'N/A'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="input-field"
                    />
                  ) : (
                    <p className="text-gray-900">{user.country || 'N/A'}</p>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900 flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(user.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Sign In</p>
                  <p className="font-medium text-gray-900 flex items-center mt-1">
                    <Activity className="w-4 h-4 mr-2" />
                    {user.lastSignIn
                      ? new Date(user.lastSignIn).toLocaleDateString('en-IN')
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <FileText className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{user.stats?.applications}</p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(user.stats?.totalSpent / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{user.stats?.tours}</p>
                  <p className="text-sm text-gray-600">Tours Booked</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{user.stats?.referrals}</p>
                  <p className="text-sm text-gray-600">Referrals</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {user.recentActivity?.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{activity.application_number}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        activity.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : activity.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
                {user.recentActivity?.length === 0 && (
                  <p className="text-center text-gray-600 py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                {user.is_active ? (
                  <button
                    onClick={handleSuspend}
                    className="w-full btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend User
                  </button>
                ) : (
                  <button
                    onClick={handleActivate}
                    className="w-full btn-outline text-green-600 border-green-600 hover:bg-green-50 flex items-center justify-center"
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    Activate User
                  </button>
                )}
                <Link
                  href={`/admin/applications?user=${userId}`}
                  className="w-full btn-outline flex items-center justify-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Applications
                </Link>
                <Link
                  href={`/admin/payments?user=${userId}`}
                  className="w-full btn-outline flex items-center justify-center"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  View Payments
                </Link>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl shadow-lg p-6 border border-primary-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-gray-900">{userId.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Referral Code</span>
                  <span className="font-mono font-bold text-primary-600">
                    {user.referral_code || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Referral Earnings</span>
                  <span className="font-bold text-green-600">
                    ₹{user.stats?.referralEarnings.toLocaleString('en-IN') || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Verified</span>
                  <span className="font-medium">
                    {user.emailVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-red-600" />
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Wallet */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Wallet Balance</h3>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">₹0</p>
                <p className="text-sm text-gray-600 mt-1">Available Balance</p>
              </div>
              <button className="w-full mt-4 btn-outline text-sm">
                View Wallet History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

