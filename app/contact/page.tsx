import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Phone</h3>
                    <p className="text-gray-600 mb-1">+91 123 456 7890</p>
                    <p className="text-gray-600">+91 987 654 3210</p>
                    <p className="text-sm text-gray-500 mt-2">Mon-Sat, 9AM-7PM</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Email</h3>
                    <p className="text-gray-600 mb-1">support@travunited.com</p>
                    <p className="text-gray-600">info@travunited.com</p>
                    <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Office</h3>
                    <p className="text-gray-600">
                      123 Business Park,<br />
                      MG Road, Bangalore,<br />
                      Karnataka 560001, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Working Hours</h3>
                    <p className="text-gray-600 mb-1">Monday - Friday: 9:00 AM - 7:00 PM</p>
                    <p className="text-gray-600 mb-1">Saturday: 10:00 AM - 5:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select className="input-field">
                        <option>Select a topic</option>
                        <option>Visa Application Query</option>
                        <option>Tour Package Query</option>
                        <option>Track Application</option>
                        <option>Payment Issue</option>
                        <option>General Inquiry</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      className="input-field"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-lg mb-2">How long does visa processing take?</h3>
                <p className="text-gray-600">
                  Processing times vary by country and visa type. E-visas typically take 2-5 days, while
                  embassy visas can take 10-30 days. Express processing is available for select countries.
                </p>
              </div>
              <div className="card">
                <h3 className="font-bold text-lg mb-2">Can I track my visa application online?</h3>
                <p className="text-gray-600">
                  Yes! You can track your application status in real-time through your dashboard or by using
                  your application number on our Track Application page.
                </p>
              </div>
              <div className="card">
                <h3 className="font-bold text-lg mb-2">What if my visa gets rejected?</h3>
                <p className="text-gray-600">
                  While we have a 99% success rate, in rare cases of rejection, we provide complete support
                  for re-application and guide you on addressing rejection reasons.
                </p>
              </div>
              <div className="card">
                <h3 className="font-bold text-lg mb-2">Are tour packages customizable?</h3>
                <p className="text-gray-600">
                  Yes! Many of our tour packages can be customized based on your preferences. Contact our
                  tour specialists to discuss your requirements.
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

