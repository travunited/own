'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Star,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  FileText,
  Clock,
  Heart,
  Users as UsersIcon,
  AlertTriangle,
  Download,
  Search,
} from 'lucide-react';

interface VisaDetailPageProps {
  slug: string;
}

export default function VisaDetailPage({ slug }: VisaDetailPageProps) {
  const [selectedDate, setSelectedDate] = useState('11-november');
  const [selectedProcessing, setSelectedProcessing] = useState('option-1');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);

  // Mock data - will be fetched from API
  const visaData = {
    title: 'Dubai (UAE) Visa for Indians',
    country: 'Dubai, UAE',
    heroImage: '/images/dubai-hero.jpg',
    guaranteeDays: 2,
    rating: 4.86,
    reviewsCount: 821,
    customersCount: '1.25L Indians',
    testimonialCategories: [
      { icon: 'heart', label: 'moms' },
      { icon: 'rings', label: 'newlyweds' },
      { icon: 'clock', label: 'last-minute planners' },
    ],
    authBanner: 'Travunited is authorized by the Government of Dubai',
    visaInfo: [
      { label: 'Visa Type', value: 'E-Visa', icon: 'smartphone', color: 'purple' },
      { label: 'Length of Stay', value: '30 days', icon: 'calendar', color: 'blue' },
      { label: 'Validity', value: '60 days', icon: 'clock', color: 'green' },
      { label: 'Entry', value: 'Single', icon: 'square', color: 'purple' },
      { label: 'Method', value: 'Paperless', icon: 'file', color: 'blue' },
    ],
    processingOptions: [
      { id: 'option-1', days: 2, deliveryTime: '11 Nov 2025 at 06:31 PM', price: 0 },
      { id: 'option-2', days: 4, deliveryTime: '13 Nov 2025 at 11:31 AM', price: 500 },
    ],
    pricing: {
      governmentFee: 6750,
      serviceFee: 1000,
      discountedFee: 0,
    },
    protection: {
      name: 'TravunitedProtect',
      isFree: true,
      delayed: 'No Service Fee',
      rejected: '100% Refund',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920)',
            backgroundPosition: 'center'
          }}
        >
          <div className="container-custom h-full flex flex-col justify-end pb-12">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 text-white px-4 py-2 rounded-full flex items-center text-sm font-semibold">
                <Check className="w-4 h-4 mr-2" />
                Visa guaranteed in {visaData.guaranteeDays} days
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {visaData.title}
            </h1>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg inline-flex items-center w-fit transition-colors">
              Check Required Documents
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Authorization Banner */}
            <div className="bg-purple-600 text-white p-4 rounded-xl flex items-center shadow-lg">
              <Shield className="w-6 h-6 mr-3 flex-shrink-0" />
              <p className="font-medium">{visaData.authBanner}</p>
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start">
                <div className="mr-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{visaData.rating}</div>
                  <div className="flex items-center text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    Loved and Trusted by {visaData.customersCount}
                  </p>
                  <div className="flex items-center flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      <span>Rated 5 stars by moms</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-1">💍</span>
                      <span>newlyweds</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1 text-orange-500" />
                      <span>last-minute planners</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visa Information Grid */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-primary-600 pb-2 inline-block">
                Dubai Visa Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {visaData.visaInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`p-3 bg-${info.color}-100 rounded-lg mr-3`}>
                      <FileText className={`w-6 h-6 text-${info.color}-600`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{info.label}</p>
                      <p className="font-semibold text-gray-900">{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processing Options */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-primary-600 pb-2 inline-block">
                Get a Guaranteed on
              </h2>
              <div className="space-y-4 mt-6">
                {visaData.processingOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`border-2 rounded-xl p-4 transition-all ${
                      selectedProcessing === option.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                          in {option.days} days
                        </p>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Check className="w-4 h-4 mr-2 text-purple-600" />
                          <span>{option.deliveryTime}</span>
                        </div>
                        <button
                          onClick={() => setExpandedTimeline(expandedTimeline === option.id ? null : option.id)}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                        >
                          View Timeline
                          {expandedTimeline === option.id ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedProcessing(option.id)}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                          selectedProcessing === option.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {selectedProcessing === option.id ? '✓ Selected' : 'Select'}
                      </button>
                    </div>

                    {/* Timeline Details */}
                    {expandedTimeline === option.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                        <div className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-gray-700">Application sent to immigration supervisor</p>
                            <p className="text-xs text-gray-500">8 Jan, 5:45 AM <span className="text-green-600 font-semibold ml-2">ON TIME</span></p>
                          </div>
                        </div>
                        <div className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5"></div>
                          <div className="flex-1">
                            <p className="text-gray-700">Application sent to internal intelligence</p>
                            <p className="text-xs text-gray-500">8 Jan, 5:45 AM <span className="text-green-600 font-semibold ml-2">ON TIME</span></p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Partners */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-primary-600 pb-2 inline-block">
                Partners We Work With
              </h2>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-12 h-12 text-gray-700 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-600">MINISTRY OF<br />FOREIGN AFFAIRS</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600 mb-1">حكومة دبي</p>
                    <p className="text-xs font-medium text-gray-600">GOVERNMENT<br />OF DUBAI</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">IATA</p>
                    <p className="text-xs text-gray-600">Certified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-primary-600 pb-2 inline-block">
                How Dubai Visa Process Works
              </h2>
              <div className="relative mt-8">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>

                <div className="space-y-8">
                  {/* Step 1 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                      1
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Apply on Travunited</h3>
                      <p className="text-gray-600">Submit your documents on Travunited — only pay government fee.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                      2
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Documents Are Verified</h3>
                      <p className="text-gray-600">Travunited verifies your documents and submits to Immigration</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                      3
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Visa Gets Processed</h3>
                      <p className="text-gray-600 mb-3">We work with Immigration to ensure you get your Visa on time.</p>
                      <div className="space-y-2 ml-4">
                        <div className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5"></div>
                          <div>
                            <p className="text-gray-700">Application has been sent to the immigration supervisor</p>
                            <p className="text-xs text-gray-500">8 Jan, 5:45 AM <span className="text-green-600 font-semibold ml-2">ON TIME</span></p>
                          </div>
                        </div>
                        <div className="flex items-start text-sm">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-1.5"></div>
                          <div>
                            <p className="text-gray-700">Application has been sent to internal intelligence</p>
                            <p className="text-xs text-gray-500">8 Jan, 5:45 AM <span className="text-green-600 font-semibold ml-2">ON TIME</span></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white z-10">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Get Your Visa on 11 Nov, 06:31 PM
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <span className="text-sm text-gray-700">Your visa is approved on time</span>
                          <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Pay Service Fee
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <span className="text-sm text-gray-700">Visa approved even one second after promised time</span>
                          <span className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Fee Waived
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <span className="text-sm text-gray-700">Your visa is rejected</span>
                          <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Fee Refunded
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dubai Visa Requirements */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-primary-600 pb-2 inline-block">
                Dubai Visa Requirements
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {['Passport', 'Photograph', 'Flight Ticket', 'Hotel Booking'].map((doc) => (
                  <div key={doc} className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{doc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Reasons */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 border-b-4 border-primary-600 pb-2 inline-block">
                Dubai Visa Rejection Reasons
              </h2>
              <p className="text-gray-600 mb-6">Factors that can get your visa rejected.</p>
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <FileText className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Expired Passport</h4>
                    <p className="text-sm text-gray-600">
                      Applying with a passport that has expired or expires within 6 months.
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Criminal Record</h4>
                    <p className="text-sm text-gray-600">
                      Having a criminal history that disqualifies you from obtaining a visa.
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Previous Visa Violations</h4>
                    <p className="text-sm text-gray-600">
                      Having overstayed or violated the terms of a previous visa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Smart AI; Ask me anything..."
                  className="input-field pr-10"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['General Information', 'Eligibility & Requirements', 'Application Process', 'Entry & Exit Regulations', 'Status Tracking', 'Refunds & Rejections'].map((cat) => (
                  <button
                    key={cat}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-3">
                {[
                  { category: 'General Information', q: 'What is a Dubai tourist visa?', a: 'A Dubai tourist visa is...' },
                  { category: 'Eligibility & Requirements', q: 'Who can apply for a Dubai visa?', a: 'Indian citizens with valid...' },
                ].map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.q ? null : faq.q)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{faq.q}</span>
                      {expandedFAQ === faq.q ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFAQ === faq.q && (
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-primary-600 pb-2 inline-block">
                Reviews
              </h2>
              
              <div className="flex items-start mb-6">
                <div className="mr-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{visaData.rating}</div>
                  <div className="flex items-center text-yellow-500 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">{visaData.reviewsCount} Reviews</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-3">Common Keywords Found in Reviews</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Quick Decision', 'Easy Application', 'Customer Support', 'Documentation', 'On Time'].map((keyword) => (
                      <span key={keyword} className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                        <Check className="w-3 h-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex gap-3 mb-6">
                <select className="input-field text-sm">
                  <option>Sort by Most Recent</option>
                  <option>Highest Rating</option>
                  <option>Most Helpful</option>
                </select>
                <select className="input-field text-sm">
                  <option>Type: All</option>
                  <option>Solo</option>
                  <option>Couple</option>
                  <option>Family</option>
                  <option>Group</option>
                </select>
              </div>

              {/* Sample Review */}
              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      RN
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Riya N</p>
                      <p className="text-sm text-gray-600">Delhi, Delhi • Solo</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                        ))}
                        <span className="text-xs text-gray-500 ml-2">6 Sep, 2025</span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                    FIRST-TIME TRAVELLER
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Unbelievable Experience: Dubai Visa Approved in Just 3 Hours!
                </h4>
                <p className="text-gray-700">
                  Amazing and received Visa within 3 hours for Dubai
                </p>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Date Selectors */}
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-medium">
                  <Check className="w-4 h-4 inline mr-1" />
                  11 November
                </button>
                <button className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  11 November
                </button>
              </div>

              {/* Guarantee Card */}
              <div className="bg-purple-600 text-white rounded-xl p-6 text-center">
                <Check className="w-12 h-12 mx-auto mb-3" />
                <p className="text-xl font-bold">Get Your Visa in {visaData.guaranteeDays} days</p>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>Government fee</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{visaData.pricing.governmentFee.toLocaleString()} x 1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600">
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      <span>Travunited Fees</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-400 line-through mr-2">₹{visaData.pricing.serviceFee.toLocaleString()}</span>
                      <span className="font-bold text-green-600">₹{visaData.pricing.discountedFee} for now</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-blue-600 text-center">
                      No advance payment. Pay only when you get your visa
                    </p>
                  </div>
                </div>

                <button className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors">
                  Start Application
                </button>
              </div>

              {/* Protection */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{visaData.protection.name}</h3>
                  </div>
                  {visaData.protection.isFree && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      Free
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>If Visa Delayed — {visaData.protection.delayed}</p>
                  <p>If Rejected — {visaData.protection.rejected}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

