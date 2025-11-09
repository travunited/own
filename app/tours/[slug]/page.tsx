import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ShareButton from '@/components/social/ShareButton';
import {
  Calendar,
  Users,
  Clock,
  Star,
  CheckCircle,
  X,
  MapPin,
  Utensils,
  Bed,
  Plane,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;
  // Mock data
  const tourData: Record<string, any> = {
    'magical-dubai': {
      title: 'Magical Dubai Experience',
      destination: 'Dubai, UAE',
      duration: {
        days: 5,
        nights: 4,
      },
      price: 24999,
      rating: 4.8,
      reviews: 245,
      visaIncluded: true,
      category: 'International',
      theme: 'Family',
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Dubai Marina',
          activities: [
            'Pickup from Dubai International Airport',
            'Check-in at hotel',
            'Evening visit to Dubai Marina',
            'Dhow Cruise with dinner',
          ],
        },
        {
          day: 2,
          title: 'City Tour & Burj Khalifa',
          activities: [
            'Visit Burj Khalifa (124th floor)',
            'Dubai Mall shopping',
            'Dubai Fountain show',
            'Gold & Spice Souk visit',
          ],
        },
        {
          day: 3,
          title: 'Desert Safari Adventure',
          activities: [
            'Morning at leisure',
            'Afternoon desert safari',
            'Dune bashing experience',
            'BBQ dinner with entertainment',
          ],
        },
        {
          day: 4,
          title: 'Theme Parks & Beaches',
          activities: [
            'Visit IMG Worlds of Adventure',
            'Relaxation at Jumeirah Beach',
            'Visit Palm Jumeirah',
            'Free time for shopping',
          ],
        },
        {
          day: 5,
          title: 'Departure',
          activities: [
            'Breakfast at hotel',
            'Check-out from hotel',
            'Transfer to airport',
            'Flight back home',
          ],
        },
      ],
      inclusions: [
        '4 nights accommodation in 4-star hotel',
        'Daily breakfast',
        'All transfers in AC vehicle',
        'Dubai city tour with guide',
        'Burj Khalifa ticket (124th floor)',
        'Desert safari with BBQ dinner',
        'Dhow Cruise with dinner',
        'All entrance fees as per itinerary',
      ],
      exclusions: [
        'International flight tickets',
        'Travel insurance',
        'Lunch and dinner (except mentioned)',
        'Personal expenses',
        'Tips and gratuities',
        'Anything not mentioned in inclusions',
      ],
      hotels: [
        {
          name: 'Golden Tulip Hotel or Similar',
          rating: 4,
          location: 'Bur Dubai',
          roomType: 'Deluxe Room',
        },
      ],
      departures: [
        { date: '2024-11-15', availableSeats: 8, price: 24999 },
        { date: '2024-11-22', availableSeats: 12, price: 24999 },
        { date: '2024-11-29', availableSeats: 5, price: 26999 },
      ],
    },
  };

  const tour = tourData[slug] || tourData['magical-dubai'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                {tour.visaIncluded && (
                  <span className="badge bg-white text-primary-600 mr-3">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Visa Included
                  </span>
                )}
                <span className="badge bg-primary-500 text-white">
                  {tour.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{tour.title}</h1>
              <p className="text-xl text-primary-100 mb-6">
                <MapPin className="w-5 h-5 inline mr-2" />
                {tour.destination}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{tour.duration.days} Days / {tour.duration.nights} Nights</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                  <span>{tour.rating}/5 ({tour.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="card bg-white">
              <div className="mb-4">
                <p className="text-3xl font-bold text-primary-600">
                  ₹{tour.price.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600">per person (excluding flights)</p>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Departure Date
                  </label>
                  <select className="input-field">
                    {tour.departures.map((dep: any, index: number) => (
                      <option key={index} value={dep.date}>
                        {new Date(dep.date).toLocaleDateString()} - {dep.availableSeats} seats
                        left - ₹{dep.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Travelers
                  </label>
                  <input type="number" min="1" defaultValue="2" className="input-field" />
                </div>
              </div>

              <Link href="/tour-booking" className="btn-primary w-full flex items-center justify-center">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              
              <button className="btn-outline w-full mt-3">
                Enquire Now
              </button>

              {/* Share Tour */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3 text-center">
                  Love this tour? Share with friends!
                </p>
                <ShareButton
                  title={`Check out this amazing ${tour.destination} tour!`}
                  description={`${tour.duration.days} days, ${tour.duration.nights} nights. ${tour.highlights.join(', ')}. Starting at ₹${tour.price.toLocaleString('en-IN')}`}
                  url={`/tours/${slug}`}
                  hashtags={[tour.destination.replace(/,.*/, ''), 'TravelGoals', 'Travunited']}
                  variant="secondary"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Day-wise Itinerary</h2>

          <div className="space-y-6">
            {tour.itinerary.map((day: any) => (
              <div key={day.day} className="card">
                <div className="flex items-start">
                  <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">{day.title}</h3>
                    <ul className="space-y-2">
                      {day.activities.map((activity: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions & Exclusions */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inclusions */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <ul className="space-y-3">
                {tour.inclusions.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Not Included</h2>
              <ul className="space-y-3">
                {tour.exclusions.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <X className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Accommodation</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tour.hotels.map((hotel: any, index: number) => (
              <div key={index} className="card">
                <Bed className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="font-bold text-lg text-gray-900 mb-2">{hotel.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span>{hotel.rating} Star Hotel</span>
                  </div>
                  <p className="text-gray-600">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {hotel.location}
                  </p>
                  <p className="text-gray-600">Room: {hotel.roomType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Miss This Amazing Experience!</h2>
          <p className="text-xl text-primary-100 mb-8">Limited seats available. Book now!</p>
          <Link href="/tour-booking" className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-10 rounded-lg transition-colors inline-block">
            Book This Tour Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

