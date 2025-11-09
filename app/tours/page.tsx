import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, Filter, Calendar, Users, Star, CheckCircle, MapPin, Clock } from 'lucide-react';

export default function ToursPage() {
  const tours = [
    {
      id: 1,
      title: 'Magical Dubai Experience',
      slug: 'magical-dubai-experience',
      destination: 'Dubai, UAE',
      duration: '5 Days / 4 Nights',
      price: 24999,
      rating: 4.8,
      reviews: 245,
      category: 'International',
      theme: 'Family',
      visaIncluded: true,
      highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Marina Cruise'],
      availableSeats: 12,
    },
    {
      id: 2,
      title: 'Romantic Maldives Getaway',
      slug: 'romantic-maldives-getaway',
      destination: 'Maldives',
      duration: '6 Days / 5 Nights',
      price: 45999,
      rating: 4.9,
      reviews: 189,
      category: 'International',
      theme: 'Honeymoon',
      visaIncluded: true,
      highlights: ['Private Villa', 'Water Sports', 'Candlelight Dinner', 'Spa'],
      availableSeats: 8,
    },
    {
      id: 3,
      title: 'Swiss Splendor',
      slug: 'swiss-splendor',
      destination: 'Switzerland',
      duration: '7 Days / 6 Nights',
      price: 89999,
      rating: 4.7,
      reviews: 321,
      category: 'International',
      theme: 'Luxury',
      visaIncluded: true,
      highlights: ['Jungfraujoch', 'Interlaken', 'Lucerne', 'Swiss Alps'],
      availableSeats: 5,
    },
    {
      id: 4,
      title: 'Exotic Bali Adventure',
      slug: 'exotic-bali-adventure',
      destination: 'Bali, Indonesia',
      duration: '5 Days / 4 Nights',
      price: 22999,
      rating: 4.6,
      reviews: 412,
      category: 'International',
      theme: 'Adventure',
      visaIncluded: true,
      highlights: ['Ubud Rice Terraces', 'Temple Tours', 'Beach Clubs', 'Water Sports'],
      availableSeats: 15,
    },
    {
      id: 5,
      title: 'Incredible Kashmir',
      slug: 'incredible-kashmir',
      destination: 'Kashmir, India',
      duration: '6 Days / 5 Nights',
      price: 18999,
      rating: 4.8,
      reviews: 567,
      category: 'Domestic',
      theme: 'Family',
      visaIncluded: false,
      highlights: ['Gulmarg', 'Pahalgam', 'Dal Lake', 'Shikara Ride'],
      availableSeats: 20,
    },
    {
      id: 6,
      title: 'Goa Beach Paradise',
      slug: 'goa-beach-paradise',
      destination: 'Goa, India',
      duration: '4 Days / 3 Nights',
      price: 12999,
      rating: 4.5,
      reviews: 734,
      category: 'Domestic',
      theme: 'Weekend',
      visaIncluded: false,
      highlights: ['Beach Hopping', 'Water Sports', 'Fort Aguada', 'Night Parties'],
      availableSeats: 25,
    },
    {
      id: 7,
      title: 'Paris City of Love',
      slug: 'paris-city-of-love',
      destination: 'Paris, France',
      duration: '6 Days / 5 Nights',
      price: 79999,
      rating: 4.9,
      reviews: 298,
      category: 'International',
      theme: 'Honeymoon',
      visaIncluded: true,
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise', 'Disneyland'],
      availableSeats: 6,
    },
    {
      id: 8,
      title: 'Thailand Complete Tour',
      slug: 'thailand-complete-tour',
      destination: 'Bangkok & Pattaya',
      duration: '7 Days / 6 Nights',
      price: 28999,
      rating: 4.7,
      reviews: 523,
      category: 'International',
      theme: 'Family',
      visaIncluded: true,
      highlights: ['Bangkok City Tour', 'Coral Island', 'Safari World', 'Alcazar Show'],
      availableSeats: 18,
    },
    {
      id: 9,
      title: 'Kerala Backwaters',
      slug: 'kerala-backwaters',
      destination: 'Kerala, India',
      duration: '5 Days / 4 Nights',
      price: 15999,
      rating: 4.8,
      reviews: 456,
      category: 'Domestic',
      theme: 'Luxury',
      visaIncluded: false,
      highlights: ['Houseboat Stay', 'Munnar Hills', 'Thekkady', 'Alleppey'],
      availableSeats: 10,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tour Packages</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Handpicked destinations with complete travel solutions. Domestic & International tours.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Destination..."
                  className="input-field pl-10"
                />
              </div>
              <select className="input-field">
                <option value="">All Themes</option>
                <option value="honeymoon">Honeymoon</option>
                <option value="family">Family</option>
                <option value="adventure">Adventure</option>
                <option value="luxury">Luxury</option>
                <option value="weekend">Weekend</option>
              </select>
              <select className="input-field">
                <option value="">Budget</option>
                <option value="0-20000">Under ₹20,000</option>
                <option value="20000-50000">₹20,000 - ₹50,000</option>
                <option value="50000-100000">₹50,000 - ₹1,00,000</option>
                <option value="100000+">Above ₹1,00,000</option>
              </select>
              <button className="btn-primary flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">{tours.length} tours found</p>
            <select className="input-field w-auto">
              <option>Sort by: Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
              <option>Duration</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tours.map((tour) => (
              <div key={tour.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Tour Image Placeholder */}
                  <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-16 h-16 text-primary-600" />
                  </div>

                  {/* Tour Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{tour.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {tour.destination}
                        </p>
                      </div>
                      {tour.visaIncluded && (
                        <span className="badge bg-blue-100 text-blue-800 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Visa
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tour.duration}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                        {tour.rating} ({tour.reviews} reviews)
                      </span>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Highlights:</p>
                      <div className="flex flex-wrap gap-2">
                        {tour.highlights.slice(0, 3).map((highlight) => (
                          <span key={highlight} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {highlight}
                          </span>
                        ))}
                        {tour.highlights.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            +{tour.highlights.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          ₹{tour.price.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-600">per person</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-sm text-orange-600 font-medium">
                          Only {tour.availableSeats} seats left
                        </p>
                        <Link href={`/tours/${tour.slug}`} className="btn-primary">
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Book Tours with Travunited?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">All-Inclusive Packages</h3>
                <p className="text-gray-600">
                  Flights, hotels, meals, sightseeing - everything covered
                </p>
              </div>
              <div>
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Expert Tour Guides</h3>
                <p className="text-gray-600">
                  Experienced guides to make your trip memorable
                </p>
              </div>
              <div>
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visa Assistance</h3>
                <p className="text-gray-600">
                  Optional visa processing included in packages
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

