'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  Plus,
  Minus,
  Check,
  ArrowLeft,
  CreditCard,
} from 'lucide-react';

export default function TourBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const [tourSlug, setTourSlug] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    travelDate: '',
    returnDate: '',
    numberOfTravelers: 2,
    leadTraveler: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    travelers: [] as any[],
    specialRequests: '',
  });

  useEffect(() => {
    const initialize = async () => {
      const resolvedParams = await params;
      setTourSlug(resolvedParams.slug);
    };
    initialize();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleLeadTravelerChange = (field: string, value: string) => {
    setBookingData({
      ...bookingData,
      leadTraveler: { ...bookingData.leadTraveler, [field]: value },
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tours/${tourSlug}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/tours/${data.booking.id}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Book Your Tour
          </h1>

          {/* Step 1: Travel Dates & Travelers */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Travel Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.travelDate}
                    onChange={(e) =>
                      handleInputChange('travelDate', e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.returnDate}
                    onChange={(e) =>
                      handleInputChange('returnDate', e.target.value)
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Travelers *
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() =>
                      handleInputChange(
                        'numberOfTravelers',
                        Math.max(1, bookingData.numberOfTravelers - 1)
                      )
                    }
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                    {bookingData.numberOfTravelers}
                  </span>
                  <button
                    onClick={() =>
                      handleInputChange(
                        'numberOfTravelers',
                        bookingData.numberOfTravelers + 1
                      )
                    }
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!bookingData.travelDate}
                className="w-full btn-primary py-4"
              >
                Continue to Traveler Details →
              </button>
            </div>
          )}

          {/* Step 2: Traveler Information */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Lead Traveler Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.leadTraveler.firstName}
                    onChange={(e) =>
                      handleLeadTravelerChange('firstName', e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.leadTraveler.lastName}
                    onChange={(e) =>
                      handleLeadTravelerChange('lastName', e.target.value)
                    }
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
                    value={bookingData.leadTraveler.email}
                    onChange={(e) =>
                      handleLeadTravelerChange('email', e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.leadTraveler.phone}
                    onChange={(e) =>
                      handleLeadTravelerChange('phone', e.target.value)
                    }
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests
                </label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) =>
                    handleInputChange('specialRequests', e.target.value)
                  }
                  className="input-field"
                  rows={4}
                  placeholder="Dietary restrictions, accessibility needs, etc."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 btn-outline py-4"
                >
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 btn-primary py-4">
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Review & Payment
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Travel Date</span>
                    <span className="font-medium">
                      {new Date(bookingData.travelDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of Travelers</span>
                    <span className="font-medium">
                      {bookingData.numberOfTravelers}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">
                      ₹XX,XXX
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 btn-outline py-4"
                >
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 btn-primary py-4 flex items-center justify-center"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

