'use client';

import { useState } from 'react';
import { Search, Users, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VisaSearchCard() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    country: '',
    visaType: '',
    travellers: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.country) {
      router.push(`/visas/${formData.country.toLowerCase()}`);
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-2xl font-bold text-white mb-6">Apply for Visa</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Select Country
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-3 pl-10 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
              required
            >
              <option value="">Choose destination</option>
              <option value="dubai">Dubai (UAE)</option>
              <option value="singapore">Singapore</option>
              <option value="uk">United Kingdom</option>
              <option value="schengen">Schengen</option>
              <option value="usa">United States</option>
              <option value="thailand">Thailand</option>
              <option value="malaysia">Malaysia</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Visa Type
          </label>
          <select
            value={formData.visaType}
            onChange={(e) => setFormData({ ...formData, visaType: e.target.value })}
            className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
          >
            <option value="">All Types</option>
            <option value="tourist">Tourist Visa</option>
            <option value="business">Business Visa</option>
            <option value="transit">Transit Visa</option>
            <option value="student">Student Visa</option>
            <option value="work">Work Visa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Number of Travellers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input
              type="number"
              min="1"
              max="20"
              value={formData.travellers}
              onChange={(e) => setFormData({ ...formData, travellers: parseInt(e.target.value) })}
              className="w-full px-4 py-3 pl-10 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-white hover:bg-white/90 text-primary-700 font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center shadow-lg">
          <Search className="w-5 h-5 mr-2" />
          Search Visa
        </button>
      </form>
    </div>
  );
}

