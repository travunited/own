'use client';

import Link from 'next/link';
import { Plane, Calendar, Users, Eye, Download, MapPin } from 'lucide-react';

export default function DashboardToursPage() {
  const bookings = [
    {
      id: 'TOUR001',
      tourName: 'Magical Dubai Experience',
      destination: 'Dubai, UAE',
      duration: '5D/4N',
      departureDate: '2024-11-15',
      returnDate: '2024-11-19',
      guests: 2,
      amount: 49998,
      status: 'CONFIRMED',
      bookingDate: '2024-10-25',
    },
    {
      id: 'TOUR002',
      tourName: 'Romantic Maldives Getaway',
      destination: 'Maldives',
      duration: '6D/5N',
      departureDate: '2024-12-10',
      returnDate: '2024-12-15',
      guests: 2,
      amount: 91998,
      status: 'PENDING',
      bookingDate: '2024-11-05',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      CONFIRMED: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tour Bookings</h1>
          <p className="text-gray-600 mt-1">View and manage your tour bookings</p>
        </div>
        <Link href="/tours" className="btn-primary">
          Browse Tours
        </Link>
      </div>

      {/* Bookings Grid */}
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 mr-3">
                    {booking.tourName}
                  </h3>
                  <span className={`badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-gray-600 flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {booking.destination} • {booking.duration}
                </p>
                <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-2xl font-bold text-primary-600">
                  ₹{booking.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600">{booking.guests} Guests</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Departure</p>
                <p className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(booking.departureDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Return</p>
                <p className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(booking.returnDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Booked On</p>
                <p className="font-medium">
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <Link
                href={`/dashboard/tours/${booking.id}`}
                className="btn-primary flex items-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
              {booking.status === 'CONFIRMED' && (
                <>
                  <button className="btn-outline flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Voucher
                  </button>
                  <button className="btn-outline flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </button>
                </>
              )}
              {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                <button className="btn-outline text-red-600 border-red-600">
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="card text-center py-12">
          <Plane className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Tour Bookings Yet</h3>
          <p className="text-gray-600 mb-6">
            Explore our curated tour packages for your next adventure
          </p>
          <Link href="/tours" className="btn-primary inline-flex items-center">
            Browse Tours
          </Link>
        </div>
      )}
    </div>
  );
}

