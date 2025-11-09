'use client';

import { useState } from 'react';
import { Search, Download, Eye, RefreshCw, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const transactions = [
    {
      id: '1',
      orderId: 'ORD12345',
      razorpayOrderId: 'order_xxx123',
      razorpayPaymentId: 'pay_yyy456',
      customer: 'John Doe',
      type: 'Visa',
      reference: 'TRV12345',
      amount: 11000,
      method: 'UPI',
      status: 'SUCCESS',
      date: '2024-11-08T10:40:00',
    },
    {
      id: '2',
      orderId: 'ORD12346',
      razorpayOrderId: 'order_xxx124',
      razorpayPaymentId: 'pay_yyy457',
      customer: 'Jane Smith',
      type: 'Tour',
      reference: 'TOUR001',
      amount: 49998,
      method: 'Card',
      status: 'SUCCESS',
      date: '2024-11-08T11:20:00',
    },
    {
      id: '3',
      orderId: 'ORD12347',
      razorpayOrderId: 'order_xxx125',
      razorpayPaymentId: null,
      customer: 'Amit Kumar',
      type: 'Visa',
      reference: 'TRV12346',
      amount: 8000,
      method: 'UPI',
      status: 'FAILED',
      date: '2024-11-08T12:15:00',
    },
  ];

  const stats = [
    {
      label: "Today's Revenue",
      value: '₹2,45,890',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'This Month',
      value: '₹45,67,890',
      change: '+8.3%',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Pending Payments',
      value: '₹1,23,450',
      change: '8 orders',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Success Rate',
      value: '96.5%',
      change: '+1.2%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-1">Monitor transactions and process refunds</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-outline flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Reconcile
          </button>
          <button className="btn-outline flex items-center">
            <Download className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid md:grid-cols-5 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              className="input-field pl-10"
            />
          </div>
          <select className="input-field">
            <option>All Status</option>
            <option>Success</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
          <select className="input-field">
            <option>All Types</option>
            <option>Visa</option>
            <option>Tour</option>
          </select>
          <select className="input-field">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Custom Range</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                  Method
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
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{txn.orderId}</p>
                      <p className="text-xs text-gray-500">{txn.razorpayOrderId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{txn.customer}</td>
                  <td className="px-4 py-4">
                    <span className="badge bg-gray-100 text-gray-800 text-xs">
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    ₹{txn.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">{txn.method}</td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs ${getStatusColor(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-primary-600 hover:text-primary-700">
                        <Eye className="w-4 h-4" />
                      </button>
                      {txn.status === 'SUCCESS' && (
                        <button className="text-red-600 hover:text-red-700 text-xs">
                          Refund
                        </button>
                      )}
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

