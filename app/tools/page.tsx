'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Camera,
  CheckCircle,
  Calculator,
  FileText,
  Clock,
  Mail,
  MapPin,
  Shield,
  Search,
  Download,
} from 'lucide-react';

export default function ToolsHubPage() {
  const tools = [
    {
      id: 'photo-creator',
      name: 'Visa Photo Creator',
      description: 'Create perfect visa photos with correct size and background',
      icon: Camera,
      color: 'purple',
      link: '/tools/photo-creator',
      popular: true,
    },
    {
      id: 'requirement-checker',
      name: 'Visa Requirement Checker',
      description: 'Check if you need a visa and what documents are required',
      icon: CheckCircle,
      color: 'blue',
      link: '/tools/requirement-checker',
      popular: true,
    },
    {
      id: 'fee-calculator',
      name: 'Visa Fee Calculator',
      description: 'Calculate total visa costs including fees and add-ons',
      icon: Calculator,
      color: 'green',
      link: '/tools/fee-calculator',
      popular: true,
    },
    {
      id: 'processing-estimator',
      name: 'Processing Time Estimator',
      description: 'Estimate how long your visa will take to process',
      icon: Clock,
      color: 'orange',
      link: '/tools/processing-estimator',
      popular: false,
    },
    {
      id: 'cover-letter',
      name: 'Cover Letter Generator',
      description: 'Generate professional cover letters for visa applications',
      icon: FileText,
      color: 'indigo',
      link: '/tools/cover-letter',
      popular: true,
    },
    {
      id: 'invitation-letter',
      name: 'Invitation Letter Template',
      description: 'Create invitation letters for visitor visa applications',
      icon: Mail,
      color: 'pink',
      link: '/tools/invitation-letter',
      popular: false,
    },
    {
      id: 'appointment-checker',
      name: 'Embassy Appointment Checker',
      description: 'Check appointment availability at embassies',
      icon: MapPin,
      color: 'cyan',
      link: '/tools/appointment-checker',
      popular: false,
    },
    {
      id: 'document-templates',
      name: 'Document Templates',
      description: 'Download templates for bank statements, employment letters, etc.',
      icon: Download,
      color: 'teal',
      link: '/tools/document-templates',
      popular: false,
    },
    {
      id: 'eligibility-checker',
      name: 'Eligibility Checker',
      description: 'Check if you\'re eligible for a specific visa type',
      icon: Shield,
      color: 'red',
      link: '/tools/eligibility-checker',
      popular: false,
    },
  ];

  const popularTools = tools.filter(t => t.popular);
  const allTools = tools;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-20">
          <div className="container-custom text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Free Visa Tools & Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Visa Application Tools
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Free tools to help you prepare the perfect visa application
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for tools..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Tools */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.link}
                    className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-primary-300 transition-all"
                  >
                    <div className={`w-12 h-12 bg-${tool.color}-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${tool.color}-600`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {tool.description}
                    </p>
                    <div className="flex items-center text-primary-600 font-medium text-sm">
                      <span>Use Tool</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* All Tools */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">All Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    href={tool.link}
                    className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-primary-300 transition-all"
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-10 h-10 bg-${tool.color}-100 rounded-lg flex items-center justify-center mr-3`}>
                        <Icon className={`w-5 h-5 text-${tool.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply for Your Visa?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Use our tools to prepare, then submit your application in minutes
            </p>
            <Link href="/visas" className="inline-flex items-center bg-white text-primary-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg transition-colors">
              Browse Visa Services
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

