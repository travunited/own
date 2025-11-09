'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Save,
  Eye,
  Image as ImageIcon,
  FileText,
  Star,
  Shield,
  Users,
  MessageSquare,
  Settings,
  Layers,
} from 'lucide-react';

export default function VisaPageEditorPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: 'hero', label: 'Hero & Basic', icon: ImageIcon },
    { id: 'info', label: 'Visa Information', icon: FileText },
    { id: 'processing', label: 'Processing Options', icon: Layers },
    { id: 'partners', label: 'Partners', icon: Shield },
    { id: 'process', label: 'Process Steps', icon: Users },
    { id: 'faqs', label: 'FAQs', icon: MessageSquare },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'seo', label: 'SEO & Meta', icon: Settings },
  ];

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement save API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Visa Page</h1>
            <p className="text-gray-600 mt-2">Manage all content for this visa type</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-outline flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                    ${activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Hero & Basic Tab */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Banner Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Dubai (UAE) Visa for Indians"
                    defaultValue="Dubai (UAE) Visa for Indians"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Fast and reliable visa processing"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guarantee Days
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      defaultValue="2"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guarantee Badge Text
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Visa guaranteed in X days"
                      defaultValue="Visa guaranteed in 2 days"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue="Check Required Documents"
                  />
                </div>

                <hr className="my-6" />

                <h3 className="text-lg font-semibold text-gray-900">Authorization Banner</h3>

                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="showAuthBanner"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="showAuthBanner" className="text-sm text-gray-700">
                    Show authorization banner
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Text
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue="Travunited is authorized by the Government of Dubai"
                  />
                </div>

                <hr className="my-6" />

                <h3 className="text-lg font-semibold text-gray-900">Trust Indicators</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      className="input-field"
                      defaultValue="4.86"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reviews Count
                    </label>
                    <input
                      type="number"
                      className="input-field"
                      defaultValue="821"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customers Count Text
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue="1.25L Indians"
                    placeholder="e.g., 1.25L Indians or 50,000+ travelers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial Text
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    defaultValue="Rated 5 stars by moms, newlyweds, and last-minute planners"
                  />
                </div>
              </div>
            )}

            {/* Visa Information Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Visa Information Fields</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    + Add Field
                  </button>
                </div>

                {/* Example Fields */}
                {['Visa Type', 'Length of Stay', 'Validity', 'Entry', 'Method'].map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field Name
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          defaultValue={field}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field Value
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          defaultValue={field === 'Visa Type' ? 'E-Visa' : field === 'Length of Stay' ? '30 days' : ''}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Icon
                        </label>
                        <select className="input-field">
                          <option>smartphone</option>
                          <option>calendar</option>
                          <option>clock</option>
                          <option>square</option>
                          <option>file</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Color
                        </label>
                        <select className="input-field">
                          <option>Purple</option>
                          <option>Blue</option>
                          <option>Green</option>
                          <option>Orange</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <label className="flex items-center text-sm text-gray-700">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Visible on page
                      </label>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Remove Field
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Processing Options Tab */}
            {activeTab === 'processing' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Processing Timeline Options</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    + Add Option
                  </button>
                </div>

                {/* Example Options */}
                {[
                  { name: 'Standard', days: 4, price: 0, default: true },
                  { name: 'Express', days: 2, price: 1500, default: false },
                ].map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Option Name
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          defaultValue={option.name}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Processing Days
                        </label>
                        <input
                          type="number"
                          className="input-field"
                          defaultValue={option.days}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Fee (₹)
                        </label>
                        <input
                          type="number"
                          className="input-field"
                          defaultValue={option.price}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <label className="flex items-center text-sm text-gray-700">
                        <input type="checkbox" className="mr-2" defaultChecked={option.default} />
                        Default option
                      </label>
                      <label className="flex items-center text-sm text-gray-700">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Show timeline
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    + Add FAQ
                  </button>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                  </label>
                  <select className="input-field">
                    <option>All Categories</option>
                    <option>General Information</option>
                    <option>Eligibility & Requirements</option>
                    <option>Application Process</option>
                    <option>Entry & Exit Regulations</option>
                  </select>
                </div>

                {/* FAQ Items */}
                {[1, 2].map((index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select className="input-field mb-4">
                        <option>General Information</option>
                        <option>Eligibility & Requirements</option>
                        <option>Application Process</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question
                      </label>
                      <input
                        type="text"
                        className="input-field mb-4"
                        placeholder="Enter your question here"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer
                      </label>
                      <textarea
                        className="input-field"
                        rows={4}
                        placeholder="Enter the answer here"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <label className="flex items-center text-sm text-gray-700">
                        <input type="checkbox" className="mr-2" defaultChecked />
                        Visible on page
                      </label>
                      <button className="text-red-600 hover:text-red-700 text-sm">
                        Delete FAQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Manage Reviews</h3>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">821</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Avg. Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.86</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Featured</p>
                    <p className="text-2xl font-bold text-purple-600">15</p>
                  </div>
                </div>

                {/* Common Keywords */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Common Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Quick Decision', 'Easy Application', 'Customer Support', 'Documentation', 'On Time'].map((keyword) => (
                      <div key={keyword} className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        <Check className="w-3 h-3 mr-1" />
                        <span>{keyword}</span>
                        <button className="ml-2 text-green-800 hover:text-green-900">×</button>
                      </div>
                    ))}
                    <button className="px-3 py-1 border-2 border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-gray-400">
                      + Add Keyword
                    </button>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Pending Reviews</h4>
                  {[1, 2].map((index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">Riya N</p>
                          <p className="text-sm text-gray-600">Delhi, Delhi • Solo</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                            ))}
                          </div>
                        </div>
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                          FIRST-TIME TRAVELLER
                        </span>
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">
                        Unbelievable Experience: Dubai Visa Approved in Just 3 Hours!
                      </h5>
                      <p className="text-gray-700 text-sm mb-4">
                        Amazing and received Visa within 3 hours for Dubai
                      </p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Approve
                        </button>
                        <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Feature
                        </button>
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">SEO & Meta Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Dubai Visa for Indians | Fast Processing | Travunited"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Get your Dubai visa in 2 days with Travunited. E-visa processing for Indian citizens..."
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="dubai visa, uae visa, e-visa, tourist visa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="https://yourdomain.com/images/dubai-visa-og.jpg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

