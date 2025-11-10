'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Save,
  RefreshCw,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Upload,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

export default function GeneralSettingsPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    // Site Information
    siteName: 'Travunited',
    tagline: 'Your trusted travel partner',
    description: 'Hassle-free visa and tour booking platform',
    logoUrl: '/logo.png',
    faviconUrl: '/favicon.ico',
    
    // Contact Information
    email: 'info@travunited.com',
    phone: '+91 6360392398',
    whatsapp: '+91 6360392398',
    address: '#F307, 1st Floor, Regal Nxt, Udupi, Karnataka – 576103, India',
    
    // Business Hours
    businessHours: {
      monday: '9:00 AM - 6:00 PM',
      tuesday: '9:00 AM - 6:00 PM',
      wednesday: '9:00 AM - 6:00 PM',
      thursday: '9:00 AM - 6:00 PM',
      friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    
    // Social Media
    facebook: 'https://facebook.com/travunited',
    twitter: 'https://twitter.com/travunited',
    instagram: 'https://instagram.com/travunited',
    linkedin: 'https://linkedin.com/company/travunited',
    
    // Features
    enableBlog: true,
    enableTours: true,
    enableReferrals: true,
    enableSocialShare: true,
    maintenanceMode: false,
    
    // SEO
    metaTitle: 'Travunited - Visa & Tour Booking Platform',
    metaDescription: 'Book visas and tours with ease. Trusted by thousands of travelers worldwide.',
    metaKeywords: 'visa, tour booking, travel, visa application, tour packages',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In production, load from database
      // For now, using default values
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('key', 'general_settings')
        .single();

      if (data?.value) {
        setSettings({ ...settings, ...data.value });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Save to database
      const { error: saveError } = await supabase
        .from('system_settings')
        .upsert({
          key: 'general_settings',
          value: settings,
          updated_at: new Date().toISOString(),
        });

      if (saveError) throw saveError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  const handleBusinessHoursChange = (day: string, value: string) => {
    setSettings({
      ...settings,
      businessHours: { ...settings.businessHours, [day]: value },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">General Settings</h1>
            <p className="text-gray-600">Configure your platform's basic information</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadSettings}
              disabled={saving}
              className="btn-outline flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800">Settings saved successfully!</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Site Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Site Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="input-field"
                  placeholder="Travunited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="input-field"
                  placeholder="Your trusted travel partner"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Platform description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => handleChange('logoUrl', e.target.value)}
                  className="input-field"
                  placeholder="/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favicon URL
                </label>
                <input
                  type="text"
                  value={settings.faviconUrl}
                  onChange={(e) => handleChange('faviconUrl', e.target.value)}
                  className="input-field"
                  placeholder="/favicon.ico"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Mail className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="input-field"
                  placeholder="support@travunited.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="input-field"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="input-field"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                  className="input-field"
                  placeholder="Full business address..."
                />
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(settings.businessHours).map(([day, hours]) => (
                <div key={day}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {day}
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
                    className="input-field"
                    placeholder="9:00 AM - 6:00 PM"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Facebook className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Social Media Links</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                  Facebook
                </label>
                <input
                  type="url"
                  value={settings.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  className="input-field"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                  Twitter
                </label>
                <input
                  type="url"
                  value={settings.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  className="input-field"
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Instagram className="w-4 h-4 mr-2 text-pink-600" />
                  Instagram
                </label>
                <input
                  type="url"
                  value={settings.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  className="input-field"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Linkedin className="w-4 h-4 mr-2 text-blue-700" />
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className="input-field"
                  placeholder="https://linkedin.com/..."
                />
              </div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Features</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Enable Blog</p>
                  <p className="text-sm text-gray-600">Show blog section on the platform</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableBlog}
                  onChange={(e) => handleChange('enableBlog', e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Enable Tours</p>
                  <p className="text-sm text-gray-600">Allow tour package bookings</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableTours}
                  onChange={(e) => handleChange('enableTours', e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Enable Referral Program</p>
                  <p className="text-sm text-gray-600">Allow users to earn referral rewards</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableReferrals}
                  onChange={(e) => handleChange('enableReferrals', e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Enable Social Sharing</p>
                  <p className="text-sm text-gray-600">Show social share buttons</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableSocialShare}
                  onChange={(e) => handleChange('enableSocialShare', e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 cursor-pointer">
                <div>
                  <p className="font-medium text-red-900">Maintenance Mode</p>
                  <p className="text-sm text-red-600">
                    Disable public access (admins can still login)
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                />
              </label>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">SEO Settings</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleChange('metaTitle', e.target.value)}
                  className="input-field"
                  placeholder="Site title for search engines"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Description for search engines"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={settings.metaKeywords}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  className="input-field"
                  placeholder="visa, tour, travel, booking..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Comma-separated keywords
                </p>
              </div>
            </div>
          </div>

          {/* Save Button (Bottom) */}
          <div className="flex justify-end gap-3">
            <button
              onClick={loadSettings}
              disabled={saving}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center px-8"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving Changes...' : 'Save All Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

