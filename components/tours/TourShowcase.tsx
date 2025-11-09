import Link from 'next/link';
import { MapPin, Clock, Users, Star, ChevronRight, TrendingUp } from 'lucide-react';

export default function TourShowcase() {
  const featuredTours = [
    {
      id: 1,
      title: 'Odisha - 3 Nights 4 Days',
      slug: 'odisha-3-nights-4-days',
      destination: 'Odisha, India',
      duration: '3N/4D',
      price: 15999,
      originalPrice: 18999,
      discount: 16,
      rating: 4.8,
      reviews: 234,
      image: '/tours/odisha.jpg',
      tourType: 'domestic',
      theme: 'Cultural',
      difficulty: 'Easy',
      groupSize: '10-25',
      highlights: ['Konark Sun Temple', 'Puri Beach', 'Jagannath Temple', 'Local Culture'],
    },
    {
      id: 2,
      title: 'Kerala Backwaters - 5 Nights 6 Days',
      slug: 'kerala-backwaters-5-nights-6-days',
      destination: 'Kerala, India',
      duration: '5N/6D',
      price: 22999,
      originalPrice: 26999,
      discount: 15,
      rating: 4.9,
      reviews: 456,
      image: '/tours/kerala.jpg',
      tourType: 'domestic',
      theme: 'Nature',
      difficulty: 'Easy',
      groupSize: '8-20',
      highlights: ['Houseboat Stay', 'Munnar Hills', 'Thekkady Wildlife', 'Alleppey'],
    },
    {
      id: 3,
      title: 'Magical Dubai - 4 Nights 5 Days',
      slug: 'magical-dubai-4-nights-5-days',
      destination: 'Dubai, UAE',
      duration: '4N/5D',
      price: 34999,
      originalPrice: 39999,
      discount: 13,
      rating: 4.7,
      reviews: 678,
      image: '/tours/dubai.jpg',
      tourType: 'international',
      theme: 'Luxury',
      difficulty: 'Easy',
      groupSize: '12-30',
      highlights: ['Burj Khalifa', 'Desert Safari', 'Dubai Mall', 'Marina Cruise'],
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Bestselling Tour Packages
            </h2>
            <p className="text-lg text-gray-600">
              Curated experiences with flights, hotels, and guided tours
            </p>
          </div>
          <Link
            href="/tours"
            className="btn-primary flex items-center group"
          >
            View All Tours
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredTours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-64 bg-gradient-to-br from-primary-400 to-purple-500 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="w-24 h-24 text-white opacity-30" />
                </div>
                {tour.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tour.discount}% OFF
                  </div>
                )}
                {tour.tourType === 'domestic' && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    🇮🇳 Domestic
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-semibold">
                    {tour.theme}
                  </span>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold">{tour.rating}</span>
                    <span className="ml-1">({tour.reviews})</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {tour.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{tour.destination}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{tour.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Group Size: {tour.groupSize}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {tour.highlights.slice(0, 3).map((highlight, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {highlight}
                    </span>
                  ))}
                  {tour.highlights.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      +{tour.highlights.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    {tour.originalPrice > tour.price && (
                      <p className="text-sm text-gray-500 line-through">
                        ₹{tour.originalPrice.toLocaleString('en-IN')}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-primary-600">
                      ₹{tour.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-gray-600">per person</p>
                  </div>
                  <div className="btn-primary group-hover:bg-primary-700">
                    Book Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

