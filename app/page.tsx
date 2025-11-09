import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisaSearchCard from '@/components/VisaSearchCard';
import TourSearchCard from '@/components/TourSearchCard';
import WorldMap from '@/components/WorldMap';
import {
  Globe,
  Shield,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  MapPin,
  Plane,
  FileCheck,
  Award,
  Zap,
  HeadphonesIcon,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const topVisaDestinations = [
    { name: 'Dubai', country: 'UAE', price: '₹5,499', processing: '2-3 days', image: '🇦🇪' },
    { name: 'Singapore', country: 'Singapore', price: '₹3,999', processing: '3-5 days', image: '🇸🇬' },
    { name: 'United Kingdom', country: 'UK', price: '₹12,999', processing: '15-20 days', image: '🇬🇧' },
    { name: 'Schengen', country: 'Europe', price: '₹8,999', processing: '10-15 days', image: '🇪🇺' },
    { name: 'Thailand', country: 'Thailand', price: '₹2,999', processing: '4-6 days', image: '🇹🇭' },
    { name: 'Malaysia', country: 'Malaysia', price: '₹3,499', processing: '3-4 days', image: '🇲🇾' },
  ];

  const featuredTours = [
    {
      title: 'Magical Dubai - 5D/4N',
      price: '₹24,999',
      duration: '5 Days',
      rating: 4.8,
      reviews: 245,
      image: 'dubai-tour',
      visaIncluded: true,
    },
    {
      title: 'Romantic Maldives - 6D/5N',
      price: '₹45,999',
      duration: '6 Days',
      rating: 4.9,
      reviews: 189,
      image: 'maldives-tour',
      visaIncluded: true,
    },
    {
      title: 'Swiss Splendor - 7D/6N',
      price: '₹89,999',
      duration: '7 Days',
      rating: 4.7,
      reviews: 321,
      image: 'swiss-tour',
      visaIncluded: true,
    },
  ];

  const trustStats = [
    { icon: Users, label: 'Happy Customers', value: '50,000+' },
    { icon: FileCheck, label: 'Visas Processed', value: '75,000+' },
    { icon: Globe, label: 'Countries Covered', value: '100+' },
    { icon: Star, label: 'Customer Rating', value: '4.8/5' },
  ];

  const howItWorksVisa = [
    { step: 1, title: 'Select Visa', description: 'Choose country and visa type' },
    { step: 2, title: 'Fill Details', description: 'Add traveller information' },
    { step: 3, title: 'Upload Documents', description: 'Submit required documents' },
    { step: 4, title: 'Track & Receive', description: 'Get updates & receive visa' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      comment: 'Super smooth Dubai visa process! Got it in just 2 days. Highly recommended.',
    },
    {
      name: 'Rahul Patel',
      location: 'Ahmedabad',
      rating: 5,
      comment: 'Booked Maldives tour package. Everything was perfect from visa to hotel bookings.',
    },
    {
      name: 'Anjali Singh',
      location: 'Delhi',
      rating: 5,
      comment: 'Professional service and great support team. Made my UK visa application hassle-free.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section with World Map */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f1729] via-[#1e3a8a] to-[#1e40af]">
        {/* Animated World Map Background */}
        <WorldMap />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f1729]/50"></div>
        
        {/* Content */}
        <div className="relative z-10 container-custom py-20">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-6 border border-white/20">
              <Globe className="w-4 h-4 mr-2" />
              <span>Trusted by 50,000+ travelers worldwide</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Explore the World<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                with Confidence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-4">
              Your trusted partner for hassle-free visas and unforgettable journeys
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                <span>99% Success Rate</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center">
                <HeadphonesIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Glassmorphism Search Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <VisaSearchCard />
            </div>
            <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]">
              <TourSearchCard />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Visa Destinations - Premium Design */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span>100+ Countries Available</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top Visa Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Apply for visas to the world's most popular destinations with guaranteed approval
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topVisaDestinations.map((dest, index) => (
              <Link
                key={dest.name}
                href={`/visas/${dest.name.toLowerCase()}`}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header with Flag */}
                <div className="relative h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <span className="text-8xl relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                    {dest.image}
                  </span>
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      E-Visa
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="font-bold text-2xl text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{dest.country}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        Processing
                      </span>
                      <span className="font-semibold text-gray-900">{dest.processing}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Starting from</span>
                      <span className="text-3xl font-bold text-primary-600">{dest.price}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-primary-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                      Apply Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/visas" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Explore All Destinations
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours - Premium Carousel Design */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-green-600 text-sm mb-4">
              <Plane className="w-4 h-4 mr-2" />
              <span>Curated by Travel Experts</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Bestselling Tour Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked destinations with complete travel solutions and visa assistance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour, index) => (
              <div 
                key={tour.title} 
                className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Image Area with Gradient Overlay */}
                <div className="relative h-64 bg-gradient-to-br from-blue-400 via-primary-500 to-purple-600 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plane className="w-24 h-24 text-white/30 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-700" />
                  </div>
                  {/* Overlay for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Badges on image */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    {tour.visaIncluded && (
                      <span className="bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Visa Included
                      </span>
                    )}
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      Bestseller
                    </span>
                  </div>

                  {/* Title on image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-2xl text-white mb-1">{tour.title}</h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {tour.duration}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900">{tour.rating}</span>
                      <span className="ml-1">({tour.reviews})</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Starting from</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                        {tour.price}
                      </p>
                    </div>
                    <Link 
                      href={`/tours/${tour.title.toLowerCase().replace(/\s+/g, '-')}`} 
                      className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/tours" 
              className="inline-flex items-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all hover:scale-105"
            >
              Explore All Tours
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">Simple steps to get your visa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksVisa.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < howItWorksVisa.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest from Blog - Magazine Style */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 rounded-full text-purple-600 text-sm mb-4">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>Travel Insights & Guides</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert tips, destination guides, and travel stories to inspire your next adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Featured Blog Posts */}
            <Link href="/blog/dubai-visa-guide-for-indians-2024" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileCheck className="w-20 h-20 text-white/30" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                      Visa Guide
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    Complete Dubai Visa Guide for Indians 2024
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Everything you need to know about applying for a Dubai visa as an Indian citizen...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>5 min read</span>
                    <span className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform flex items-center">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/blog/top-10-schengen-countries-to-visit" className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-500 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="w-20 h-20 text-white/30" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                      Destinations
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    Top 10 Schengen Countries to Visit in 2024
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Discover the most beautiful and tourist-friendly Schengen countries for your next European adventure...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>7 min read</span>
                    <span className="text-primary-600 font-semibold group-hover:translate-x-2 transition-transform flex items-center">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/blog" className="group">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex items-center justify-center p-8 text-center">
                <div>
                  <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
                  <h3 className="font-bold text-2xl text-white mb-2">
                    Explore More Stories
                  </h3>
                  <p className="text-blue-100 mb-4">
                    Read all our travel guides, tips, and destination reviews
                  </p>
                  <span className="inline-flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                    View All Articles
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Carousel */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-800 text-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl"></div>
        
        <div className="container-custom relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-4">
              <Award className="w-4 h-4 mr-2" />
              <span>Rated 4.8/5 by 10,000+ customers</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Trusted by thousands of travelers for their visa and tour needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name} 
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Star Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                {/* Comment */}
                <p className="text-white text-lg mb-6 italic leading-relaxed">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>
                
                {/* Customer Info */}
                <div className="flex items-center pt-6 border-t border-white/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                    <p className="text-sm text-blue-200 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">50,000+</p>
              <p className="text-blue-200">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">99%</p>
              <p className="text-blue-200">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">4.8/5</p>
              <p className="text-blue-200">Customer Rating</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-white mb-2">24/7</p>
              <p className="text-blue-200">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Apply for your visa or book your dream tour today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/visas" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors">
              Apply for Visa
            </Link>
            <Link href="/tours" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors">
              Browse Tours
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

