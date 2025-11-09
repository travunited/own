import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Target, Award, Heart, Globe, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Travunited</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Making travel dreams come true through seamless visa services and curated tour experiences
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4">
              Founded in 2015, Travunited began with a simple mission: to make international travel accessible
              and hassle-free for everyone. What started as a small visa processing service has grown into a
              comprehensive travel platform serving thousands of happy travelers across India.
            </p>
            <p className="text-lg text-gray-700 mb-4">
              We understand that travel is more than just visiting new places—it's about creating memories,
              experiencing cultures, and broadening horizons. That's why we've expanded our services to include
              carefully curated tour packages that take the stress out of planning and let you focus on the joy
              of exploration.
            </p>
            <p className="text-lg text-gray-700">
              Today, with over 75,000 visas processed and 50,000+ happy customers, we continue to innovate and
              improve our services, always putting our customers first.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="text-gray-600">
                Every decision we make is centered around providing the best experience for our customers
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
              <p className="text-gray-600">
                We believe in honest communication and transparent pricing with no hidden fees
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for perfection in every application and tour package we deliver
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">50K+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">75K+</p>
              <p className="text-gray-600">Visas Processed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">100+</p>
              <p className="text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">4.8/5</p>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="card">
              <Globe className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
              <p className="text-gray-600">
                Visa services for 100+ countries and tour packages to top destinations worldwide
              </p>
            </div>
            <div className="card">
              <Users className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Experienced visa consultants and travel experts to guide you at every step
              </p>
            </div>
            <div className="card">
              <Shield className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600">
                Your documents and personal information are protected with bank-level security
              </p>
            </div>
            <div className="card">
              <Award className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">High Success Rate</h3>
              <p className="text-gray-600">
                Our meticulous process ensures a 99% visa approval success rate
              </p>
            </div>
            <div className="card">
              <Target className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Transparent Pricing</h3>
              <p className="text-gray-600">
                No hidden charges. What you see is what you pay
              </p>
            </div>
            <div className="card">
              <Heart className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is always available to help you
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

