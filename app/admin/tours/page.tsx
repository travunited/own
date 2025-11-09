'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Calendar, Users, DollarSign } from 'lucide-react';

export default function AdminToursPage() {
  const tours = [
    {
      id: 1,
      title: 'Magical Dubai - 5D/4N',
      slug: 'magical-dubai',
      destination: 'Dubai, UAE',
      duration: '5D/4N',
      price: 24999,
      category: 'International',
      theme: 'Family',
      status: 'Active',
      bookings: 45,
      revenue: 1124955,
      nextDeparture: '2024-11-15',
      availableSeats: 8,
      totalSeats: 20,
    },
    {
      id: 2,
      title: 'Romantic Maldives - 6D/5N',
      slug: 'romantic-maldives',
      destination: 'Maldives',
      duration: '6D/5N',
      price: 45999,
      category: 'International',
      theme: 'Honeymoon',
      status: 'Active',
      bookings: 28,
      revenue: 1287972,
      nextDeparture: '2024-11-20',
      availableSeats: 4,
      totalSeats: 15,
    },
    {
      id: 3,
      title: 'Swiss Splendor - 7D/6N',
      slug: 'swiss-splendor',
      destination: 'Switzerland',
      duration: '7D/6N',
      price: 89999,
      category: 'International',
      theme: 'Luxury',
      status: 'Active',
      bookings: 18,
      revenue: 1619982,
      nextDeparture: '2024-12-01',
      availableSeats: 5,
      totalSeats: 12,
    },
  ];

  const stats = [
    { label: 'Active Tours', value: '45', icon: Calendar },
    { label: 'Total Bookings', value: '234', icon: Users },
    { label: 'This Month Revenue', value: '₹45.2L', icon: DollarSign },
    { label: 'Avg Occupancy', value: '78%', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-gray-600 mt-1">Manage tour packages and bookings</p>
        </div>
        <Link href="/admin/tours/create" className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Create New Tour
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="card">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tours..."
              className="input-field pl-10"
            />
          </div>
          <select className="input-field">
            <option>All Categories</option>
            <option>International</option>
            <option>Domestic</option>
          </select>
          <select className="input-field">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      {/* Tours Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Tour
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Destination
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Bookings
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Next Departure
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tours.map((tour) => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{tour.title}</p>
                      <p className="text-xs text-gray-500">{tour.duration}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {tour.destination}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    ₹{tour.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{tour.bookings}</td>
                  <td className="px-4 py-4 text-sm font-medium text-primary-600">
                    ₹{(tour.revenue / 100000).toFixed(2)}L
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-gray-900">
                        {new Date(tour.nextDeparture).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tour.availableSeats}/{tour.totalSeats} seats
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="badge bg-green-100 text-green-800 text-xs">
                      {tour.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/tours/${tour.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/tours/edit/${tour.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

