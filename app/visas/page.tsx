import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, Filter, MapPin, Clock, BadgeCheck } from 'lucide-react';

export default function VisasPage() {
  const allVisas = [
    {
      id: 1,
      country: 'United Arab Emirates',
      shortName: 'Dubai',
      flag: '🇦🇪',
      slug: 'dubai',
      types: ['Tourist', 'Business', 'Transit'],
      startingPrice: 5499,
      processing: '2-3 days',
      isEVisa: true,
      expressAvailable: true,
    },
    {
      id: 2,
      country: 'Singapore',
      shortName: 'Singapore',
      flag: '🇸🇬',
      slug: 'singapore',
      types: ['Tourist', 'Business'],
      startingPrice: 3999,
      processing: '3-5 days',
      isEVisa: true,
      expressAvailable: true,
    },
    {
      id: 3,
      country: 'United Kingdom',
      shortName: 'UK',
      flag: '🇬🇧',
      slug: 'uk',
      types: ['Tourist', 'Business', 'Student', 'Work'],
      startingPrice: 12999,
      processing: '15-20 days',
      isEVisa: false,
      expressAvailable: false,
      interviewRequired: true,
    },
    {
      id: 4,
      country: 'Schengen Area',
      shortName: 'Schengen',
      flag: '🇪🇺',
      slug: 'schengen',
      types: ['Tourist', 'Business'],
      startingPrice: 8999,
      processing: '10-15 days',
      isEVisa: false,
      expressAvailable: true,
    },
    {
      id: 5,
      country: 'United States',
      shortName: 'USA',
      flag: '🇺🇸',
      slug: 'usa',
      types: ['Tourist', 'Business', 'Student', 'Work'],
      startingPrice: 15999,
      processing: '20-30 days',
      isEVisa: false,
      expressAvailable: false,
      interviewRequired: true,
    },
    {
      id: 6,
      country: 'Thailand',
      shortName: 'Thailand',
      flag: '🇹🇭',
      slug: 'thailand',
      types: ['Tourist', 'Business'],
      startingPrice: 2999,
      processing: '4-6 days',
      isEVisa: true,
      expressAvailable: true,
    },
    {
      id: 7,
      country: 'Malaysia',
      shortName: 'Malaysia',
      flag: '🇲🇾',
      slug: 'malaysia',
      types: ['Tourist', 'Business'],
      startingPrice: 3499,
      processing: '3-4 days',
      isEVisa: true,
      expressAvailable: true,
    },
    {
      id: 8,
      country: 'Australia',
      shortName: 'Australia',
      flag: '🇦🇺',
      slug: 'australia',
      types: ['Tourist', 'Business', 'Student', 'Work'],
      startingPrice: 13999,
      processing: '15-25 days',
      isEVisa: true,
      expressAvailable: false,
    },
    {
      id: 9,
      country: 'Canada',
      shortName: 'Canada',
      flag: '🇨🇦',
      slug: 'canada',
      types: ['Tourist', 'Business', 'Student', 'Work'],
      startingPrice: 14999,
      processing: '20-30 days',
      isEVisa: true,
      expressAvailable: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Visa Services</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Apply for visas to 100+ countries. Fast, secure, and hassle-free.
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search country..."
                  className="input-field pl-10"
                />
              </div>
              <select className="input-field md:w-64">
                <option value="">All Visa Types</option>
                <option value="tourist">Tourist</option>
                <option value="business">Business</option>
                <option value="student">Student</option>
                <option value="work">Work</option>
                <option value="transit">Transit</option>
              </select>
              <button className="btn-outline flex items-center justify-center">
                <Filter className="w-5 h-5 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Cards Section */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allVisas.map((visa) => (
              <Link
                key={visa.id}
                href={`/visas/${visa.slug}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-5xl mr-4">{visa.flag}</span>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{visa.shortName}</h3>
                      <p className="text-sm text-gray-600">{visa.country}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {visa.isEVisa && (
                    <span className="badge bg-green-100 text-green-800">
                      <BadgeCheck className="w-4 h-4 mr-1" />
                      E-Visa Available
                    </span>
                  )}
                  {visa.expressAvailable && (
                    <span className="badge bg-blue-100 text-blue-800 ml-2">
                      Express Available
                    </span>
                  )}
                  {visa.interviewRequired && (
                    <span className="badge bg-orange-100 text-orange-800 ml-2">
                      Interview Required
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Available Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {visa.types.map((type) => (
                      <span key={type} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">
                      ₹{visa.startingPrice.toLocaleString('en-IN')}
                    </p>
                    <p className="text-sm text-gray-600">Starting from</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="font-medium">{visa.processing}</span>
                    </div>
                    <p className="text-sm text-gray-600">Processing</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Travunited for Visa Services?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">100% Success Rate</h3>
                <p className="text-gray-600">
                  We ensure all documents are verified before submission
                </p>
              </div>
              <div>
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fast Processing</h3>
                <p className="text-gray-600">
                  Express options available for urgent travel needs
                </p>
              </div>
              <div>
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">100+ Countries</h3>
                <p className="text-gray-600">
                  Visa services for destinations worldwide
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

