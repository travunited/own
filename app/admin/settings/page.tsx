'use client';

import { useState } from 'react';
import { Save, TestTube } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General' },
    { id: 'email', label: 'Email' },
    { id: 'payment', label: 'Payment Gateway' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'team', label: 'Team' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure system settings and integrations</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === 'general' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Travunited"
                    className="input-field"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@travunited.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Phone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+91 6360392398"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Office Address
                  </label>
                  <textarea
                    defaultValue="123 Business Park, Bangalore, Karnataka 560001, India"
                    rows={3}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select className="input-field">
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <button className="btn-primary flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'email' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Email Configuration</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      placeholder="smtp.gmail.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SMTP Port
                    </label>
                    <input type="number" defaultValue="587" className="input-field" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="noreply@travunited.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="btn-outline flex items-center">
                    <TestTube className="w-5 h-5 mr-2" />
                    Test Email
                  </button>
                  <button className="btn-primary flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payment' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Razorpay Configuration
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Mode
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="mode" className="mr-2" />
                      <span>Test Mode</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="mode" className="mr-2" defaultChecked />
                      <span>Live Mode</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    placeholder="rzp_live_xxxxxxxxxxxxx"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razorpay Key Secret
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    defaultValue="https://travunited.com/api/razorpay/webhook"
                    className="input-field"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Configure this URL in Razorpay dashboard
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Methods
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Credit/Debit Cards</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>UPI</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Net Banking</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span>Wallets</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span>EMI</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button className="btn-outline">Test Connection</button>
                  <button className="btn-primary flex items-center">
                    <Save className="w-5 h-5 mr-2" />
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Email Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">New Application</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Payment Received</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Document Uploaded</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">SLA Breach Warning</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">Daily Summary Report</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Recipients
                  </label>
                  <input
                    type="text"
                    defaultValue="admin@travunited.com, ops@travunited.com"
                    className="input-field"
                    placeholder="Comma separated emails"
                  />
                </div>

                <button className="btn-primary flex items-center">
                  <Save className="w-5 h-5 mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

