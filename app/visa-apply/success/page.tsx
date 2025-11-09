import Link from 'next/link';
import { CheckCircle, Download, Home, FileText, MessageSquare } from 'lucide-react';
import ShareButton from '@/components/social/ShareButton';

export default function VisaApplicationSuccess() {
  // Get application ID from URL params
  const applicationId = 'TRV' + Date.now().toString().slice(-8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your visa application has been received and is being processed
          </p>

          {/* Application Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600 mb-1">Application Number</p>
                <p className="font-bold text-lg text-primary-600">{applicationId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-bold text-lg">Payment Successful</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                <p className="font-medium">{new Date().toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estimated Completion</p>
                <p className="font-medium">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-lg text-blue-900 mb-3">What happens next?</h3>
            <ol className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>You'll receive a confirmation email with all details shortly</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Our team will review your documents within 24 hours</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>We'll submit your application to the embassy</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Track real-time updates in your dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">5.</span>
                <span>Receive your approved visa via email/courier</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button className="btn-outline flex items-center justify-center">
              <Download className="w-5 h-5 mr-2" />
              Download Receipt
            </button>
            <Link href="/dashboard" className="btn-primary flex items-center justify-center">
              <FileText className="w-5 h-5 mr-2" />
              View Dashboard
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/" className="btn-secondary flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link href="/support" className="btn-outline flex items-center justify-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Contact Support
            </Link>
          </div>

          {/* Share Success */}
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl border border-primary-200">
            <h3 className="font-bold text-lg text-gray-900 mb-2">
              🎉 Share your success!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Help your friends get their visa too! Share and both of you get ₹500 discount
            </p>
            <ShareButton
              title="I just got my visa through Travunited! ✈️"
              description="Applied online, super easy process! Got approved in just a few days. Highly recommend Travunited for hassle-free visa processing."
              url="https://travunited.com"
              hashtags={['Travunited', 'VisaApproved', 'TravelMadeEasy']}
              variant="primary"
              className="w-full"
            />
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 text-white">
          <p className="mb-2">Need help? We're here for you!</p>
          <p className="font-medium">
            📞 +91 123 456 7890 | ✉️ support@travunited.com
          </p>
        </div>
      </div>
    </div>
  );
}

