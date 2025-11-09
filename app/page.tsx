import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisaSearchCard from '@/components/VisaSearchCard';
import TourSearchCard from '@/components/TourSearchCard';
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Your Journey Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Hassle-free visa applications and curated tour packages. One platform, endless possibilities.
            </p>
          </div>

          {/* Search Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <VisaSearchCard />
            <TourSearchCard />
          </div>
        </div>
      </section>

      {/* Top Visa Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Visa Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Apply for visas to your favorite destinations with ease
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topVisaDestinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/visas/${dest.name.toLowerCase()}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-4xl mr-3">{dest.image}</span>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{dest.name}</h3>
                      <p className="text-sm text-gray-600">{dest.country}</p>
                    </div>
                  </div>
                  <span className="badge bg-green-100 text-green-800">E-Visa</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">{dest.price}</p>
                    <p className="text-sm text-gray-600">Starting from</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{dest.processing}</p>
                    <p className="text-sm text-gray-600">Processing</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/visas" className="btn-primary inline-flex items-center">
              View All Visa Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bestselling Tour Packages
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked destinations with complete travel solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour) => (
              <div key={tour.title} className="card hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <Plane className="w-16 h-16 text-primary-600" />
                </div>
                <div className="space-y-3">
                  {tour.visaIncluded && (
                    <span className="badge bg-blue-100 text-blue-800">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Visa Included
                    </span>
                  )}
                  <h3 className="font-bold text-xl text-gray-900">{tour.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {tour.duration}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      {tour.rating} ({tour.reviews})
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">{tour.price}</p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                    <Link href={`/tours/${tour.title.toLowerCase().replace(/\s+/g, '-')}`} className="btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tours" className="btn-outline inline-flex items-center">
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

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600">Trusted by thousands of travelers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.comment}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
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

