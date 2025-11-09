'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  FileText,
  Calendar,
  MapPin,
  X,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminApplicationsPage() {
  const supabase = createClientComponentClient();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedVisaTypes, setSelectedVisaTypes] = useState<string[]>([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);

  // Available options
  const [countries, setCountries] = useState<any[]>([]);
  const [visaTypes, setVisaTypes] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);

  const statusOptions = ['pending', 'under_review', 'documents_requested', 'approved', 'rejected'];
  const paymentStatusOptions = ['pending', 'completed', 'failed', 'refunded'];

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [
    searchTerm,
    selectedStatuses,
    selectedCountries,
    selectedVisaTypes,
    selectedPaymentStatuses,
    dateRange,
    selectedAdmins,
  ]);

  const loadData = async () => {
    try {
      // Load applications with user data
      const { data: apps, error } = await supabase
        .from('visa_applications')
        .select(`
          *,
          user:user_profiles(full_name, email, avatar_url),
          country:visa_countries(name, flag),
          visa_type:visa_types(name, category)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(apps || []);

      // Calculate stats
      const pending = apps?.filter((a) => a.status === 'pending').length || 0;
      const approved = apps?.filter((a) => a.status === 'approved').length || 0;
      const rejected = apps?.filter((a) => a.status === 'rejected').length || 0;

      setStats({
        total: apps?.length || 0,
        pending,
        approved,
        rejected,
      });

      // Load filter options
      const [
        { data: countriesData },
        { data: visaTypesData },
        { data: adminsData },
      ] = await Promise.all([
        supabase.from('visa_countries').select('id, name'),
        supabase.from('visa_types').select('id, name'),
        supabase.from('user_profiles').select('id, full_name').eq('role', 'admin'),
      ]);

      setCountries(countriesData || []);
      setVisaTypes(visaTypesData || []);
      setAdmins(adminsData || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.application_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((app) => selectedStatuses.includes(app.status));
    }

    // Country filter
    if (selectedCountries.length > 0) {
      filtered = filtered.filter((app) => selectedCountries.includes(app.country_id));
    }

    // Visa type filter
    if (selectedVisaTypes.length > 0) {
      filtered = filtered.filter((app) => selectedVisaTypes.includes(app.visa_type_id));
    }

    // Payment status filter
    if (selectedPaymentStatuses.length > 0) {
      filtered = filtered.filter((app) => selectedPaymentStatuses.includes(app.payment_status));
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter(
        (app) => new Date(app.created_at) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      filtered = filtered.filter(
        (app) => new Date(app.created_at) <= new Date(dateRange.to + 'T23:59:59')
      );
    }

    return filtered;
  };

  const filteredApplications = filterApplications();

  const toggleFilter = (value: string, selected: string[], setter: Function) => {
    if (selected.includes(value)) {
      setter(selected.filter((v) => v !== value));
    } else {
      setter([...selected, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedCountries([]);
    setSelectedVisaTypes([]);
    setSelectedPaymentStatuses([]);
    setDateRange({ from: '', to: '' });
    setSelectedAdmins([]);
    setSearchTerm('');
  };

  const activeFilterCount =
    selectedStatuses.length +
    selectedCountries.length +
    selectedVisaTypes.length +
    selectedPaymentStatuses.length +
    selectedAdmins.length +
    (dateRange.from ? 1 : 0) +
    (dateRange.to ? 1 : 0);

  const exportToCSV = () => {
    const csvData = filteredApplications.map((app) => ({
      'Application Number': app.application_number,
      'User': app.user?.full_name || 'N/A',
      'Email': app.user?.email || 'N/A',
      'Country': app.country?.name || 'N/A',
      'Visa Type': app.visa_type?.name || 'N/A',
      'Status': app.status,
      'Payment': app.payment_status,
      'Date': new Date(app.created_at).toLocaleDateString(),
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Applications</h1>
          <p className="text-gray-600">Advanced search and filtering for all visa applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <FileText className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.rejected}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by application number, user name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center px-6"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>
            <button onClick={exportToCSV} className="btn-primary flex items-center px-6">
              <Download className="w-5 h-5 mr-2" />
              Export
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        toggleFilter(status, selectedStatuses, setSelectedStatuses)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedStatuses.includes(status)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="flex flex-wrap gap-2">
                  {countries.map((country) => (
                    <button
                      key={country.id}
                      onClick={() =>
                        toggleFilter(country.id, selectedCountries, setSelectedCountries)
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCountries.includes(country.id)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {paymentStatusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        toggleFilter(
                          status,
                          selectedPaymentStatuses,
                          setSelectedPaymentStatuses
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPaymentStatuses.includes(status)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="w-full btn-outline text-red-600 border-red-600 hover:bg-red-50 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters ({activeFilterCount})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              {filteredApplications.length} Application{filteredApplications.length !== 1 ? 's' : ''}{' '}
              Found
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{app.application_number}</div>
                      <div className="text-sm text-gray-500">{app.visa_type?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                          {app.user?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {app.user?.full_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{app.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{app.country?.flag}</span>
                        <span className="font-medium text-gray-900">{app.country?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          app.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          app.payment_status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : app.payment_status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {app.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/applications/${app.id}/review`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

