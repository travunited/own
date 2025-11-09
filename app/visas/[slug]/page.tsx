import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  Clock,
  FileText,
  CheckCircle,
  DollarSign,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function VisaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  // Mock data - will be fetched from database
  const visaData: Record<string, any> = {
    dubai: {
      country: 'United Arab Emirates',
      shortName: 'Dubai',
      flag: '🇦🇪',
      description: 'Experience the luxury and culture of Dubai with our hassle-free visa service',
      visaTypes: [
        {
          id: 'tourist-30',
          name: 'Tourist Visa - 30 Days',
          price: 5499,
          processing: '2-3 days',
          validity: '60 days',
          stay: '30 days',
          isEVisa: true,
          expressAvailable: true,
        },
        {
          id: 'tourist-90',
          name: 'Tourist Visa - 90 Days',
          price: 8999,
          processing: '3-4 days',
          validity: '60 days',
          stay: '90 days',
          isEVisa: true,
          expressAvailable: true,
        },
        {
          id: 'business',
          name: 'Business Visa',
          price: 7999,
          processing: '3-4 days',
          validity: '90 days',
          stay: '30 days',
          isEVisa: true,
          expressAvailable: false,
        },
      ],
      documents: [
        'Passport (valid for at least 6 months)',
        'Passport-size photograph (white background)',
        'Confirmed flight tickets',
        'Hotel booking confirmation',
        'Bank statement (last 6 months)',
      ],
      eligibility: [
        'Valid passport with minimum 6 months validity',
        'Sufficient funds for stay in UAE',
        'Return ticket or onward journey ticket',
        'No criminal record',
        'Not blacklisted in UAE',
      ],
      importantNotes: [
        'Dubai visa is an e-visa delivered via email',
        'No embassy visit required',
        'Visa approval is subject to UAE government discretion',
        'Processing time may vary during peak season',
        'Ensure all documents are clear and readable',
      ],
      faqs: [
        {
          question: 'How long does it take to get a Dubai visa?',
          answer: 'Dubai tourist visa typically takes 2-3 working days for standard processing. Express processing is available for urgent travel needs.',
        },
        {
          question: 'Is Dubai visa on arrival available for Indians?',
          answer: 'Yes, Indians can get visa on arrival, but we recommend applying for e-visa in advance for a hassle-free experience.',
        },
        {
          question: 'What is the validity of Dubai tourist visa?',
          answer: 'Dubai tourist visa is valid for 60 days from the date of issue. You can stay for 30 days or 90 days depending on the visa type chosen.',
        },
        {
          question: 'Can I extend my Dubai visa?',
          answer: 'Yes, visa extension is possible from within UAE by contacting local immigration authorities or through authorized agents.',
        },
      ],
    },
  };

  const visa = visaData[slug] || visaData.dubai;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <span className="text-6xl mr-4">{visa.flag}</span>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {visa.shortName} Visa for Indians
              </h1>
              <p className="text-xl text-primary-100">{visa.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-8 text-primary-100">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Fast Processing (2-3 days)</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>E-Visa Available</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>Starting ₹5,499</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visa Types */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Visa Types</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {visa.visaTypes.map((type: any) => (
              <div key={type.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-900">{type.name}</h3>
                  {type.isEVisa && (
                    <span className="badge bg-green-100 text-green-800 text-xs">E-Visa</span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing</span>
                    <span className="font-medium">{type.processing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Validity</span>
                    <span className="font-medium">{type.validity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stay Duration</span>
                    <span className="font-medium">{type.stay}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-primary-600">
                        ₹{type.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-600">per person</p>
                    </div>
                  </div>
                  <Link
                    href="/visa-apply"
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    Apply Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Documents Required</h2>

          <div className="card max-w-3xl">
            <ul className="space-y-3">
              {visa.documents.map((doc: string, index: number) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Important:</p>
                  <p>All documents should be clear, readable, and in accepted formats (PDF, JPG, PNG).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Eligibility Criteria</h2>

          <div className="card max-w-3xl">
            <ul className="space-y-3">
              {visa.eligibility.map((criteria: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-700">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Important Information</h2>

          <div className="card max-w-3xl bg-yellow-50 border-yellow-200">
            <ul className="space-y-3">
              {visa.importantNotes.map((note: string, index: number) => (
                <li key={index} className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>

          <div className="max-w-3xl space-y-4">
            {visa.faqs.map((faq: any, index: number) => (
              <div key={index} className="card">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply for Your {visa.shortName} Visa?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get your visa in {visa.visaTypes[0].processing} with our expert assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/visa-apply" className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg transition-colors">
              Start Application
            </Link>
            <Link href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-3 px-8 rounded-lg transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

