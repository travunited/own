'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

export default function CountriesManagementPage() {
  const supabase = createClientComponentClient();
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/countries');
      const data = await response.json();

      if (data.success) {
        setCountries(data.countries || []);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
      alert('Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (countryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/super-admin/countries/${countryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      const data = await response.json();

      if (data.success) {
        await loadCountries();
      } else {
        alert('Failed to update country status');
      }
    } catch (error) {
      console.error('Error toggling country status:', error);
      alert('Failed to update country status');
    }
  };

  const filteredCountries = countries.filter((country) =>
    country.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading countries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Countries & Visa Management</h1>
            <p className="text-gray-600">Add and manage visa destinations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadCountries}
              className="btn-outline flex items-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </button>
            <Link
              href="/super-admin/countries/create"
              className="btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Country
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Countries</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{countries.length}</p>
              </div>
              <Globe className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {countries.filter((c) => c.is_active).length}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-gray-600 mt-2">
                  {countries.filter((c) => !c.is_active).length}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-gray-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Popular</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {countries.filter((c) => c.is_popular).length}
                </p>
              </div>
              <FileText className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country) => (
            <div
              key={country.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-4xl mr-3">{country.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{country.name}</h3>
                      <p className="text-sm text-gray-600">{country.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {country.is_popular && (
                      <span className="px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                        Popular
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        country.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {country.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{country.continent || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    <span>{country.processing_time || 'Not specified'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/super-admin/countries/${country.id}/edit`}
                    className="flex-1 btn-outline text-sm py-2 flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleActive(country.id, country.is_active)}
                    className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${
                      country.is_active
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {country.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCountries.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No countries found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first country'}
            </p>
            {!searchTerm && (
              <Link
                href="/super-admin/countries/create"
                className="btn-primary inline-flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Country
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

