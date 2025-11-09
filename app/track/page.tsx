import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, FileText } from 'lucide-react';

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Application</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Enter your application number and contact details to track your visa or tour booking status
          </p>
        </div>
      </section>

      {/* Track Form */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Application</h2>
                <p className="text-gray-600">
                  Enter your details to get real-time status updates
                </p>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Type *
                  </label>
                  <select className="input-field" required>
                    <option value="">Select type</option>
                    <option value="visa">Visa Application</option>
                    <option value="tour">Tour Booking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application/Booking Number *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TRV12345ABC or ORD67890XYZ"
                    className="input-field"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can find this number in your confirmation email
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      OR Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      className="input-field"
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Track Application
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-bold text-lg mb-2 text-blue-900">For Visa Applications</h3>
                <p className="text-blue-800 text-sm">
                  Track your visa application status from document verification to final approval.
                  Get real-time updates via email and SMS.
                </p>
              </div>
              <div className="card bg-green-50 border-green-200">
                <h3 className="font-bold text-lg mb-2 text-green-900">For Tour Bookings</h3>
                <p className="text-green-800 text-sm">
                  Check your tour booking status, view vouchers, and access important travel documents
                  all in one place.
                </p>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Can't find your application number?{' '}
                <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

