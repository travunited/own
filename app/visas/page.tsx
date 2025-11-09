import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, MapPin, Clock, DollarSign, Star, ChevronRight, TrendingUp } from 'lucide-react';

export default function VisasPage() {
  const popularDestinations = [
    {
      id: 1,
      country: 'Thailand',
      flag: '🇹🇭',
      slug: 'thailand-tourist-visa',
      visaTypes: ['Tourist Visa', 'Business Visa'],
      processingTime: '3-5 days',
      price: 2500,
      rating: 4.8,
      applications: '15K+',
      featured: true,
    },
    {
      id: 2,
      country: 'Singapore',
      flag: '🇸🇬',
      slug: 'singapore-tourist-visa',
      visaTypes: ['Tourist Visa', 'Business Visa'],
      processingTime: '2-4 days',
      price: 4500,
      rating: 4.9,
      applications: '12K+',
      featured: true,
    },
    {
      id: 3,
      country: 'Dubai (UAE)',
      flag: '🇦🇪',
      slug: 'dubai-tourist-visa',
      visaTypes: ['Tourist Visa', '30 Days', '90 Days'],
      processingTime: '3-4 days',
      price: 5000,
      rating: 4.7,
      applications: '20K+',
      featured: true,
    },
    {
      id: 4,
      country: 'Malaysia',
      flag: '🇲🇾',
      slug: 'malaysia-tourist-visa',
      visaTypes: ['eVisa', 'Tourist Visa'],
      processingTime: '2-3 days',
      price: 2000,
      rating: 4.6,
      applications: '8K+',
      featured: true,
    },
    {
      id: 5,
      country: 'USA',
      flag: '🇺🇸',
      slug: 'usa-tourist-visa',
      visaTypes: ['B1/B2 Visa', 'Tourist', 'Business'],
      processingTime: '15-30 days',
      price: 15000,
      rating: 4.5,
      applications: '25K+',
      featured: false,
    },
    {
      id: 6,
      country: 'UK',
      flag: '🇬🇧',
      slug: 'uk-tourist-visa',
      visaTypes: ['Standard Visitor', 'Tourist'],
      processingTime: '15-20 days',
      price: 12000,
      rating: 4.6,
      applications: '18K+',
      featured: false,
    },
    {
      id: 7,
      country: 'Australia',
      flag: '🇦🇺',
      slug: 'australia-tourist-visa',
      visaTypes: ['Visitor Visa (subclass 600)'],
      processingTime: '20-25 days',
      price: 18000,
      rating: 4.7,
      applications: '10K+',
      featured: false,
    },
    {
      id: 8,
      country: 'Canada',
      flag: '🇨🇦',
      slug: 'canada-tourist-visa',
      visaTypes: ['Visitor Visa', 'Tourist'],
      processingTime: '15-20 days',
      price: 14000,
      rating: 4.6,
      applications: '12K+',
      featured: false,
    },
    {
      id: 9,
      country: 'Schengen',
      flag: '🇪🇺',
      slug: 'schengen-visa',
      visaTypes: ['Tourist', 'Business', 'Visit'],
      processingTime: '10-15 days',
      price: 8000,
      rating: 4.8,
      applications: '30K+',
      featured: false,
    },
    {
      id: 10,
      country: 'Japan',
      flag: '🇯🇵',
      slug: 'japan-tourist-visa',
      visaTypes: ['Tourist Visa', 'Short-stay'],
      processingTime: '5-7 days',
      price: 3500,
      rating: 4.7,
      applications: '7K+',
      featured: false,
    },
    {
      id: 11,
      country: 'South Korea',
      flag: '🇰🇷',
      slug: 'south-korea-tourist-visa',
      visaTypes: ['Tourist Visa', 'Short-term'],
      processingTime: '5-7 days',
      price: 3000,
      rating: 4.6,
      applications: '6K+',
      featured: false,
    },
    {
      id: 12,
      country: 'Vietnam',
      flag: '🇻🇳',
      slug: 'vietnam-evisa',
      visaTypes: ['eVisa', 'Tourist'],
      processingTime: '2-3 days',
      price: 1500,
      rating: 4.5,
      applications: '9K+',
      featured: false,
    },
  ];

  const categories = [
    { name: 'Tourist Visa', count: 45, icon: '✈️' },
    { name: 'Business Visa', count: 32, icon: '💼' },
    { name: 'Student Visa', count: 18, icon: '🎓' },
    { name: 'Work Visa', count: 25, icon: '🏢' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-purple-600 to-indigo-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get Your Visa On Time
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Apply for visas to 45+ countries. Fast processing, expert support, 95% approval rate.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div>
                <p className="text-3xl font-bold">100K+</p>
                <p className="text-sm text-white/80">Visas Processed</p>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <p className="text-3xl font-bold">4.8★</p>
                <p className="text-sm text-white/80">Customer Rating</p>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <p className="text-3xl font-bold">95%</p>
                <p className="text-sm text-white/80">Approval Rate</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search for country or visa type..."
                  className="flex-1 px-4 py-4 text-gray-900 focus:outline-none"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="font-semibold text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-600">{category.count} countries</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Visa Destinations
            </h2>
            <p className="text-gray-600 text-lg">
              Fast processing, expert support, high approval rates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination) => (
              <Link
                key={destination.id}
                href={`/visas/${destination.slug}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Flag Header */}
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-8 text-center relative">
                  {destination.featured && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  <div className="text-6xl mb-3">{destination.flag}</div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {destination.country}
                  </h3>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-semibold">{destination.rating}</span>
                      <span className="ml-1">({destination.applications} visas)</span>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Processing Time
                      </span>
                      <span className="font-semibold text-gray-900">
                        {destination.processingTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Starting From
                      </span>
                      <span className="font-semibold text-gray-900">
                        ₹{destination.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-2">Available Visa Types:</p>
                    <div className="flex flex-wrap gap-2">
                      {destination.visaTypes.slice(0, 2).map((type) => (
                        <span
                          key={type}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {type}
                        </span>
                      ))}
                      {destination.visaTypes.length > 2 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{destination.visaTypes.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center group-hover:bg-primary-700">
                    Apply Now
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <button className="btn-outline text-lg px-8 py-3">
              View All Countries →
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Travunited for Visa?
            </h2>
            <p className="text-gray-600 text-lg">
              We make visa applications simple, fast, and hassle-free
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                Fast Processing
              </h3>
              <p className="text-gray-600 text-center">
                Average processing time of 3-5 days. Track your application in real-time.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                95% Approval Rate
              </h3>
              <p className="text-gray-600 text-center">
                Expert document verification ensures high approval rates for all applications.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                45+ Countries
              </h3>
              <p className="text-gray-600 text-center">
                Apply for visas to popular destinations worldwide with transparent pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-white/90 mb-8">
            Apply for your visa in just 10 minutes. Expert support every step of the way.
          </p>
          <Link
            href="/visa-apply"
            className="inline-block bg-white text-primary-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg"
          >
            Start Application Now →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
