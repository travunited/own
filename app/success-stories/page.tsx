import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuccessStoryCard from '@/components/social/SuccessStoryCard';
import { Trophy, Star, Users } from 'lucide-react';

export default function SuccessStoriesPage() {
  // Mock data - will be fetched from database
  const stories = [
    {
      id: '1',
      userName: 'Priya Sharma',
      userCity: 'Mumbai',
      visaType: 'Tourist Visa',
      country: 'Dubai',
      countryFlag: '🇦🇪',
      appliedDate: '2024-11-01',
      approvedDate: '2024-11-04',
      processingDays: 3,
      rating: 5,
      testimonial:
        'Travunited made my Dubai visa process incredibly smooth! Applied online, uploaded documents, and got approved in just 3 days. The team was very responsive and helpful throughout. Highly recommend!',
    },
    {
      id: '2',
      userName: 'Rahul Kumar',
      userCity: 'Delhi',
      visaType: 'Tourist Visa',
      country: 'Singapore',
      countryFlag: '🇸🇬',
      appliedDate: '2024-10-28',
      approvedDate: '2024-11-02',
      processingDays: 5,
      rating: 5,
      testimonial:
        'Best visa service I have used! The entire process was transparent, and I could track my application status in real-time. Got my Singapore visa without any hassle. Thank you Travunited!',
    },
    {
      id: '3',
      userName: 'Anita Patel',
      userCity: 'Bangalore',
      visaType: 'Tourist Visa',
      country: 'Thailand',
      countryFlag: '🇹🇭',
      appliedDate: '2024-10-25',
      approvedDate: '2024-10-28',
      processingDays: 3,
      rating: 5,
      testimonial:
        'Amazing experience! The platform is user-friendly, and customer support was excellent. My Thailand visa was processed super fast. Will definitely use Travunited for all my future travel needs!',
    },
  ];

  const stats = {
    totalSuccess: 5234,
    averageRating: 4.9,
    countriesCovered: 50,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-purple-600 text-white py-20">
        <div className="container-custom text-center">
          <Trophy className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Real stories from real travelers. See how Travunited has helped thousands
            achieve their travel dreams.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">
                {stats.totalSuccess.toLocaleString()}+
              </p>
              <p className="text-gray-600">Successful Applications</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.averageRating}</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.countriesCovered}+</p>
              <p className="text-gray-600">Countries Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Success Stories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <SuccessStoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-purple-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Success Story?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of happy travelers who got their visas approved through Travunited
          </p>
          <a href="/visas" className="btn-primary inline-flex items-center text-lg px-8 py-3">
            Start Your Application
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

