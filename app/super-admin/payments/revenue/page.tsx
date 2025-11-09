'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  RefreshCw,
  Download,
  Calendar,
  PieChart,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function PaymentRevenuePage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // day, week, month, year
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [visaTypeData, setVisaTypeData] = useState<any[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<any[]>([]);
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthRevenue: 0,
    todayRevenue: 0,
    totalTransactions: 0,
    avgOrderValue: 0,
    successRate: 0,
  });

  useEffect(() => {
    loadRevenueData();
  }, [timeRange]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);

      // Get all completed payments
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          application:visa_applications(
            country:visa_countries(name, flag),
            visa_type:visa_types(name, category)
          )
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Calculate stats
      const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
      
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const monthPayments = payments?.filter(
        (p) => new Date(p.created_at) >= monthStart
      ) || [];
      const todayPayments = payments?.filter(
        (p) => new Date(p.created_at) >= todayStart
      ) || [];

      const monthRevenue = monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const todayRevenue = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      setStats({
        totalRevenue,
        monthRevenue,
        todayRevenue,
        totalTransactions: payments?.length || 0,
        avgOrderValue: totalRevenue / (payments?.length || 1),
        successRate: 98.5, // Calculate based on all payment attempts
      });

      // Generate revenue trend data
      const revenueTrend = generateRevenueTrend(payments || [], timeRange);
      setRevenueData(revenueTrend);

      // Revenue by country
      const countryRevenue: any = {};
      payments?.forEach((payment) => {
        const country = payment.application?.country?.name || 'Unknown';
        countryRevenue[country] = (countryRevenue[country] || 0) + (payment.amount || 0);
      });
      setCountryData(
        Object.entries(countryRevenue)
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 6)
      );

      // Revenue by visa type
      const visaRevenue: any = {};
      payments?.forEach((payment) => {
        const visa = payment.application?.visa_type?.name || 'Unknown';
        visaRevenue[visa] = (visaRevenue[visa] || 0) + (payment.amount || 0);
      });
      setVisaTypeData(
        Object.entries(visaRevenue)
          .map(([name, value]) => ({ name, value }))
          .sort((a: any, b: any) => b.value - a.value)
          .slice(0, 6)
      );

      // Revenue by payment method
      const methodRevenue: any = {};
      payments?.forEach((payment) => {
        const method = payment.payment_method || 'card';
        methodRevenue[method] = (methodRevenue[method] || 0) + (payment.amount || 0);
      });
      setPaymentMethodData(
        Object.entries(methodRevenue).map(([name, value]) => ({ name, value }))
      );

    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRevenueTrend = (payments: any[], range: string) => {
    const now = new Date();
    let data: any[] = [];

    if (range === 'day') {
      // Last 24 hours by hour
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours());
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);
        
        const hourPayments = payments.filter(
          (p) => new Date(p.created_at) >= hourStart && new Date(p.created_at) < hourEnd
        );
        
        data.push({
          label: hourStart.getHours() + ':00',
          revenue: hourPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 1000,
          transactions: hourPayments.length,
        });
      }
    } else if (range === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const dayPayments = payments.filter(
          (p) => new Date(p.created_at) >= dayStart && new Date(p.created_at) < dayEnd
        );
        
        data.push({
          label: dayStart.toLocaleDateString('en-IN', { weekday: 'short' }),
          revenue: dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 1000,
          transactions: dayPayments.length,
        });
      }
    } else if (range === 'month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        
        const dayPayments = payments.filter(
          (p) => new Date(p.created_at) >= dayStart && new Date(p.created_at) < dayEnd
        );
        
        data.push({
          label: dayStart.getDate().toString(),
          revenue: dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 1000,
          transactions: dayPayments.length,
        });
      }
    } else {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59);
        
        const monthPayments = payments.filter(
          (p) => new Date(p.created_at) >= monthStart && new Date(p.created_at) <= monthEnd
        );
        
        data.push({
          label: monthStart.toLocaleDateString('en-IN', { month: 'short' }),
          revenue: monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0) / 1000,
          transactions: monthPayments.length,
        });
      }
    }

    return data;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading revenue data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Revenue Analytics</h1>
            <p className="text-gray-600">Comprehensive payment and revenue insights</p>
          </div>
          <button
            onClick={loadRevenueData}
            className="btn-outline flex items-center"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Revenue</h3>
              <DollarSign className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">
              ₹{(stats.totalRevenue / 100000).toFixed(2)}L
            </p>
            <p className="text-primary-100 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              All time
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">This Month</h3>
              <Calendar className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">
              ₹{(stats.monthRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-green-100">
              Today: ₹{(stats.todayRevenue / 1000).toFixed(1)}K
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Avg Order Value</h3>
              <CreditCard className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-4xl font-bold mb-2">
              ₹{(stats.avgOrderValue / 1000).toFixed(1)}K
            </p>
            <p className="text-purple-100">
              {stats.totalTransactions} transactions
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
            <div className="flex gap-2">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [`₹${value}K`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Country */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Country</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value: any) => [`₹${(value / 1000).toFixed(0)}K`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Visa Type */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Visa Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={visaTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${((entry.value / stats.totalRevenue) * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {visaTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`₹${(value / 1000).toFixed(0)}K`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h3>
          <div className="grid grid-cols-4 gap-4">
            {paymentMethodData.map((method, index) => (
              <div
                key={method.name}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-900 capitalize">{method.name}</p>
                  <CreditCard className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(method.value / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {((method.value / stats.totalRevenue) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

