'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Briefcase,
  FileCheck,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Clock,
  BarChart3,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  Plane,
  Hotel,
  Car,
  HeadphonesIcon,
  FileText,
  Settings,
  Send,
} from 'lucide-react';

export default function CorporatePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '+91 6360392398',
    requirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    alert('Thank you! Our corporate team will contact you within 2 business hours.');
  };

  const services = [
    {
      icon: Briefcase,
      title: 'Business Visa Processing',
      description: 'Fast-track visa processing for your business travelers',
      features: [
        'Priority processing',
        'Dedicated support',
        'Bulk applications',
        'Document management',
      ],
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Plane,
      title: 'Corporate Travel Management',
      description: 'End-to-end travel solutions for your organization',
      features: [
        'Flight bookings',
        'Hotel reservations',
        'Ground transportation',
        '24/7 support',
      ],
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Shield,
      title: 'Compliance & Documentation',
      description: 'Ensure all travel documents meet regulatory requirements',
      features: [
        'Document verification',
        'Compliance checks',
        'Policy adherence',
        'Risk assessment',
      ],
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Travel Analytics',
      description: 'Insights and reporting for informed travel decisions',
      features: [
        'Cost analysis',
        'Travel patterns',
        'Budget optimization',
        'Performance metrics',
      ],
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const benefits = [
    { icon: Users, text: 'Dedicated account manager' },
    { icon: TrendingUp, text: 'Volume-based pricing' },
    { icon: Zap, text: 'Priority processing' },
    { icon: FileText, text: 'Customized reporting' },
    { icon: HeadphonesIcon, text: '24/7 emergency support' },
    { icon: Settings, text: 'Integration with HR systems' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <Building2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Corporate Travel Solutions
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 leading-relaxed">
              Streamline your business travel with our comprehensive corporate services
              designed for modern enterprises
            </p>
            <a
              href="#contact"
              className="inline-block bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-8 rounded-lg transition-colors text-lg"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Corporate Services?
            </h2>
            <p className="text-lg text-gray-600">
              We understand the unique challenges of corporate travel and provide tailored
              solutions that save time, reduce costs, and ensure compliance.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start mb-4">
                    <div className={`p-4 rounded-lg ${service.color} mr-4 flex-shrink-0`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Corporate Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Corporate Benefits
            </h2>
            <p className="text-lg text-gray-600">
              Exclusive advantages for our corporate partners
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.text}
                  className="bg-white rounded-lg p-6 flex items-center hover:shadow-md transition-shadow"
                >
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="font-medium text-gray-900">{benefit.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact & Form Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ready to streamline your corporate travel? Contact our business travel
              specialists to discuss your requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Our Corporate Team
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Email</p>
                    <a
                      href="mailto:corporate@travunited.com"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      corporate@travunited.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Phone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Phone</p>
                    <a
                      href="tel:+916360392398"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      +91 6360392398
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <MessageSquare className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">WhatsApp Business</p>
                    <a
                      href="https://wa.me/916360392398"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      WhatsApp Support
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary-100 p-3 rounded-lg mr-4">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Response Time</p>
                    <p className="text-gray-600">
                      Typical response within 2 business hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-primary-50 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Why Corporates Trust Us</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    500+ corporate clients worldwide
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    99.9% visa approval success rate
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ISO 9001:2015 certified processes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    IATA accredited travel partner
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    Average cost savings of 30%
                  </li>
                </ul>
              </div>
            </div>

            {/* Quote Request Form */}
            <div>
              <div className="card bg-gray-50">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Request Corporate Quote
                </h3>
                <p className="text-gray-600 mb-6">
                  Tell us about your corporate travel needs
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({ ...formData, companyName: e.target.value })
                      }
                      placeholder="Your company name"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        setFormData({ ...formData, contactPerson: e.target.value })
                      }
                      placeholder="Your name"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="your.email@company.com"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 6360392398"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Travel Requirements *
                    </label>
                    <textarea
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({ ...formData, requirements: e.target.value })
                      }
                      placeholder="Tell us about your corporate travel needs, volume, destinations, etc."
                      rows={4}
                      className="input-field"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
                  </button>

                  <p className="text-xs text-gray-600 text-center">
                    By submitting this form, you agree to our{' '}
                    <a href="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Corporate Travel?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies who trust us for their business travel needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#contact"
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Schedule a Demo
            </a>
            <a
              href="tel:+916360392398"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

