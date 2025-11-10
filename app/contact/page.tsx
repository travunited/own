import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe } from 'lucide-react';

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
              {/* Main Office */}
              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Main Office - Karnataka</h3>
                    <p className="text-gray-600">
                      #F307, 1st Floor, Regal Nxt,<br />
                      Udupi, Karnataka – 576103,<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* UAE Branch */}
              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Globe className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">UAE Branch Office</h3>
                    <p className="text-gray-600">
                      #312, MRMS Building,<br />
                      Burdubai, Dubai,<br />
                      United Arab Emirates
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Phone / WhatsApp</h3>
                    <p className="text-gray-600 mb-2">
                      <a href="tel:+916360392398" className="hover:text-primary-600 font-medium">
                        +91 6360392398
                      </a>
                    </p>
                    <a
                      href="https://wa.me/916360392398"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Click to Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Addresses */}
              <div className="card">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Email Us</h3>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">General:</span>{' '}
                        <a href="mailto:info@travunited.com" className="hover:text-primary-600">
                          info@travunited.com
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Visa Support:</span>{' '}
                        <a href="mailto:visa@travunited.com" className="hover:text-primary-600">
                          visa@travunited.com
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">B2B:</span>{' '}
                        <a href="mailto:b2b@travunited.com" className="hover:text-primary-600">
                          b2b@travunited.com
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Corporate Travel:</span>{' '}
                        <a href="mailto:corporate@travunited.com" className="hover:text-primary-600">
                          corporate@travunited.com
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Media / PR:</span>{' '}
                        <a href="mailto:media@travunited.com" className="hover:text-primary-600">
                          media@travunited.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
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
                    <p className="text-sm text-gray-500 mt-2">(IST - Indian Standard Time)</p>
                  </div>
                </div>
              </div>

              {/* Future Expansion */}
              <div className="card bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-200">
                <h3 className="font-bold text-lg mb-2 text-gray-900">Coming Soon</h3>
                <p className="text-sm text-gray-700 mb-3">Future Expansion Offices:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>🇸🇦 Riyadh, Saudi Arabia</li>
                  <li>🇺🇸 Delaware, United States</li>
                  <li>🇩🇪 Berlin, Germany</li>
                </ul>
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
                        placeholder="+91 98765 43210"
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
                        <option>B2B Partnership</option>
                        <option>Corporate Travel</option>
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

                {/* Quick Contact Options */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">Prefer other ways to reach us?</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://wa.me/916360392398"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm flex items-center"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </a>
                    <a
                      href="mailto:info@travunited.com"
                      className="btn-outline text-sm flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Us
                    </a>
                    <a
                      href="tel:+916360392398"
                      className="btn-outline text-sm flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call Us
                    </a>
                  </div>
                </div>
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
                <h3 className="font-bold text-lg mb-2">Do you offer corporate travel solutions?</h3>
                <p className="text-gray-600">
                  Yes! We provide comprehensive corporate travel solutions. Contact us at{' '}
                  <a href="mailto:corporate@travunited.com" className="text-primary-600 hover:text-primary-700 font-medium">
                    corporate@travunited.com
                  </a>{' '}
                  or visit our <Link href="/corporate" className="text-primary-600 hover:text-primary-700 font-medium">Corporate Solutions</Link> page.
                </p>
              </div>
              <div className="card">
                <h3 className="font-bold text-lg mb-2">Are tour packages customizable?</h3>
                <p className="text-gray-600">
                  Yes! Many of our tour packages can be customized based on your preferences. Contact our
                  tour specialists at{' '}
                  <a href="mailto:info@travunited.com" className="text-primary-600 hover:text-primary-700 font-medium">
                    info@travunited.com
                  </a>{' '}
                  to discuss your requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations Map */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Locations</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* India Office */}
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🇮🇳</span>
                <div>
                  <h3 className="font-bold text-lg">Main Office - India</h3>
                  <p className="text-sm text-gray-600">Headquarters</p>
                </div>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong><br />
                #F307, 1st Floor, Regal Nxt,<br />
                Udupi, Karnataka – 576103, India
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> <a href="tel:+916360392398" className="text-primary-600 hover:text-primary-700">+91 6360392398</a>
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:info@travunited.com" className="text-primary-600 hover:text-primary-700">info@travunited.com</a>
              </p>
            </div>

            {/* UAE Office */}
            <div className="card">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🇦🇪</span>
                <div>
                  <h3 className="font-bold text-lg">UAE Branch Office</h3>
                  <p className="text-sm text-gray-600">Branch</p>
                </div>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong><br />
                #312, MRMS Building,<br />
                Burdubai, Dubai,<br />
                United Arab Emirates
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> <a href="tel:+916360392398" className="text-primary-600 hover:text-primary-700">+91 6360392398</a>
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> <a href="mailto:info@travunited.com" className="text-primary-600 hover:text-primary-700">info@travunited.com</a>
              </p>
            </div>
          </div>

          {/* Future Expansion */}
          <div className="card bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200">
            <h3 className="font-bold text-lg text-gray-900 mb-4 text-center">
              🌍 Future Expansion Offices (Coming Soon)
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-4xl mb-2 block">🇸🇦</span>
                <p className="font-medium text-gray-900">Riyadh</p>
                <p className="text-sm text-gray-600">Saudi Arabia</p>
              </div>
              <div>
                <span className="text-4xl mb-2 block">🇺🇸</span>
                <p className="font-medium text-gray-900">Delaware</p>
                <p className="text-sm text-gray-600">United States</p>
              </div>
              <div>
                <span className="text-4xl mb-2 block">🇩🇪</span>
                <p className="font-medium text-gray-900">Berlin</p>
                <p className="text-sm text-gray-600">Germany</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
