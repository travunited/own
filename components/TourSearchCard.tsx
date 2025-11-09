'use client';

import { useState } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TourSearchCard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    guests: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.destination) params.append('destination', formData.destination);
    if (formData.startDate) params.append('startDate', formData.startDate);
    if (formData.endDate) params.append('endDate', formData.endDate);
    params.append('guests', formData.guests.toString());
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Book Tours</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Destination
          </label>
          <select
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
            required
          >
            <option value="">Choose destination</option>
            <option value="dubai">Dubai</option>
            <option value="maldives">Maldives</option>
            <option value="bali">Bali</option>
            <option value="switzerland">Switzerland</option>
            <option value="paris">Paris</option>
            <option value="thailand">Thailand</option>
            <option value="kashmir">Kashmir</option>
            <option value="kerala">Kerala</option>
            <option value="goa">Goa</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 pl-10 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 pl-10 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                min={formData.startDate || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Number of Guests
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input
              type="number"
              min="1"
              max="20"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
              className="w-full px-4 py-3 pl-10 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-white hover:bg-white/90 text-primary-700 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center shadow-lg">
          <Search className="w-5 h-5 mr-2" />
          Search Tours
        </button>
      </form>
    </div>
  );
}

