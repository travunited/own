'use client';

import Link from 'next/link';
import { CreditCard, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function DashboardPaymentsPage() {
  const payments = [
    {
      id: 'PAY001',
      orderId: 'ORD12345',
      type: 'Visa Application',
      reference: 'TRV12345',
      amount: 11000,
      method: 'UPI',
      status: 'SUCCESS',
      date: '2024-11-08T10:40:00',
      razorpayPaymentId: 'pay_xxx123',
    },
    {
      id: 'PAY002',
      orderId: 'ORD12346',
      type: 'Tour Booking',
      reference: 'TOUR001',
      amount: 49998,
      method: 'Credit Card',
      status: 'SUCCESS',
      date: '2024-10-25T14:20:00',
      razorpayPaymentId: 'pay_xxx124',
    },
    {
      id: 'PAY003',
      orderId: 'ORD12347',
      type: 'Tour Booking',
      reference: 'TOUR002',
      amount: 91998,
      method: 'Net Banking',
      status: 'SUCCESS',
      date: '2024-11-05T16:30:00',
      razorpayPaymentId: 'pay_xxx125',
    },
  ];

  const summary = {
    totalSpent: 152996,
    successfulPayments: 3,
    pendingPayments: 0,
    refunds: 0,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1">View all your transactions and invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{summary.totalSpent.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
          <p className="text-2xl font-bold text-green-600">{summary.successfulPayments}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
          <p className="text-2xl font-bold text-yellow-600">{summary.pendingPayments}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Refunds</p>
          <p className="text-2xl font-bold text-gray-900">{summary.refunds}</p>
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <div className="mr-4">
                  {getStatusIcon(payment.status)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {payment.type}
                  </h3>
                  <p className="text-sm text-gray-600">Order ID: {payment.orderId}</p>
                  <p className="text-sm text-gray-600">Reference: {payment.reference}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Razorpay ID: {payment.razorpayPaymentId}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </p>
                <span className={`badge ${getStatusColor(payment.status)} mt-2`}>
                  {payment.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <p>
                  <span className="font-medium">Method:</span> {payment.method}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(payment.date).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="btn-outline text-sm flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  Invoice
                </button>
                <Link
                  href={`/dashboard/payments/${payment.id}`}
                  className="btn-outline text-sm flex items-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <div className="card text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Payment History</h3>
          <p className="text-gray-600">Your payment transactions will appear here</p>
        </div>
      )}
    </div>
  );
}

