'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Plus, Trash2, CreditCard, CheckCircle } from 'lucide-react';

export default function TourBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    tourId: '',
    departureDate: '',
    rooms: [{ adults: 2, children: 0 }],
    guests: [],
    addons: {
      visa: false,
      insurance: false,
      airportTransfer: false,
    },
    totalAmount: 0,
  });

  const steps = [
    { number: 1, title: 'Tour & Date' },
    { number: 2, title: 'Travelers' },
    { number: 3, title: 'Add-ons' },
    { number: 4, title: 'Payment' },
  ];

  const addRoom = () => {
    setBookingData({
      ...bookingData,
      rooms: [...bookingData.rooms, { adults: 2, children: 0 }],
    });
  };

  const removeRoom = (index: number) => {
    const newRooms = bookingData.rooms.filter((_, i) => i !== index);
    setBookingData({ ...bookingData, rooms: newRooms });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Travunited
            </Link>
            <div className="text-right">
              <p className="text-sm text-gray-600">Need help?</p>
              <a href="tel:+916360392398" className="text-primary-600 font-medium">
                +91 6360392398
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.number}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <p className="text-xs text-gray-600">Step {step.number}</p>
                      <p className="font-medium text-gray-900">{step.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        <div className="max-w-4xl mx-auto">
          {currentStep === 1 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Date & Guests</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      className="input-field pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      Room Configuration *
                    </label>
                    <button onClick={addRoom} className="btn-outline text-sm flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Room
                    </button>
                  </div>

                  <div className="space-y-4">
                    {bookingData.rooms.map((room, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">Room {index + 1}</h3>
                          {bookingData.rooms.length > 1 && (
                            <button
                              onClick={() => removeRoom(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">Adults</label>
                            <input
                              type="number"
                              min="1"
                              max="4"
                              defaultValue={room.adults}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">
                              Children
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="3"
                              defaultValue={room.children}
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary w-full"
                >
                  Continue to Traveler Details
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Traveler Information</h2>
              <p className="text-gray-600 mb-6">
                Please provide details for all travelers
              </p>

              <div className="space-y-6">
                {/* Guest forms will go here */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-4">Guest 1 (Lead)</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" className="input-field" />
                    <input type="date" placeholder="Date of Birth" className="input-field" />
                    <input type="email" placeholder="Email" className="input-field" />
                    <input type="tel" placeholder="Phone" className="input-field" />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={() => setCurrentStep(1)} className="btn-secondary">
                    Back
                  </button>
                  <button onClick={() => setCurrentStep(3)} className="btn-primary">
                    Continue to Add-ons
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Optional Add-ons</h2>

              <div className="space-y-4 mb-6">
                <label className="flex items-start border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Visa Processing</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      We'll handle your visa application
                    </p>
                    <p className="font-bold text-primary-600">+₹5,499 per person</p>
                  </div>
                </label>

                <label className="flex items-start border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Travel Insurance</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Comprehensive travel insurance coverage
                    </p>
                    <p className="font-bold text-primary-600">+₹800 per person</p>
                  </div>
                </label>

                <label className="flex items-start border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500">
                  <input type="checkbox" className="mt-1 mr-3" />
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Airport Transfer</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Pick-up and drop-off at airport
                    </p>
                    <p className="font-bold text-primary-600">+₹2,500 per trip</p>
                  </div>
                </label>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setCurrentStep(2)} className="btn-secondary">
                  Back
                </button>
                <button onClick={() => setCurrentStep(4)} className="btn-primary">
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>

              <div className="bg-primary-50 rounded-lg p-6 mb-6">
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-primary-600 mb-4">₹49,998</p>
                <p className="text-sm text-gray-700">Including GST and all charges</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500">
                    <input type="radio" name="payment" className="mr-3" defaultChecked />
                    <CreditCard className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-primary-500">
                    <input type="radio" name="payment" className="mr-3" />
                    <Users className="w-6 h-6 mr-3 text-gray-600" />
                    <span className="font-medium">UPI</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setCurrentStep(3)} className="btn-secondary">
                  Back
                </button>
                <button className="btn-primary">Complete Payment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

