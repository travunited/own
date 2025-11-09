'use client';

import { useState } from 'react';
import { Save, Mail, Phone, User, Lock, Bell } from 'lucide-react';

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  defaultValue="john@email.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  defaultValue="+91 9876543210"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button className="btn-primary flex items-center">
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Change Password</h3>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="input-field"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="input-field"
                />
              </div>
              <button className="btn-primary mt-4">Update Password</button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 mb-4">
                Add an extra layer of security to your account
              </p>
              <button className="btn-outline">Enable 2FA</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Email Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Application status updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Payment confirmations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Document upload reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm">Promotional offers</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm">Newsletter</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">SMS Notifications</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Critical updates only</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-3" />
                  <span className="text-sm">All notifications</span>
                </label>
              </div>
            </div>

            <button className="btn-primary flex items-center">
              <Save className="w-5 h-5 mr-2" />
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

