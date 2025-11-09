'use client';

import { CheckCircle, XCircle, Clock, Download, RefreshCw, ArrowLeft } from 'lucide-react';
import { formatCurrency, fromRazorpayAmount } from '@/lib/payments/pricing';
import Link from 'next/link';

interface Payment {
  id: string;
  status: string;
  amount: number;
  payment_method?: string;
  razorpay_payment_id?: string;
  razorpay_order_id: string;
  created_at: string;
  captured_at?: string;
  failed_at?: string;
  failure_reason?: string;
  attempt_number: number;
  max_attempts: number;
  invoice_number?: string;
  invoice_id?: string;
}

interface PaymentStatusProps {
  payment: Payment;
  applicationId?: string;
  canRetry?: boolean;
  onRetry?: () => void;
}

export default function PaymentStatus({
  payment,
  applicationId,
  canRetry = false,
  onRetry,
}: PaymentStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'captured':
      case 'authorized':
        return {
          icon: CheckCircle,
          color: 'green',
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          textColor: 'text-green-900',
          iconColor: 'text-green-500',
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'yellow',
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait...',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-900',
          iconColor: 'text-yellow-500',
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'red',
          title: 'Payment Failed',
          message: payment.failure_reason || 'Your payment could not be processed.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          textColor: 'text-red-900',
          iconColor: 'text-red-500',
        };
      default:
        return {
          icon: Clock,
          color: 'gray',
          title: 'Payment Status Unknown',
          message: 'Please contact support for assistance.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-500',
          textColor: 'text-gray-900',
          iconColor: 'text-gray-500',
        };
    }
  };

  const config = getStatusConfig(payment.status);
  const StatusIcon = config.icon;
  const amount = fromRazorpayAmount(payment.amount);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Card */}
      <div
        className={`${config.bgColor} border-l-4 ${config.borderColor} rounded-xl p-8 text-center`}
      >
        <StatusIcon className={`w-20 h-20 ${config.iconColor} mx-auto mb-4`} />
        <h2 className={`text-2xl font-bold ${config.textColor} mb-2`}>{config.title}</h2>
        <p className={`${config.textColor} opacity-90`}>{config.message}</p>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(amount)}
            </span>
          </div>

          {payment.payment_method && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-medium text-gray-900 capitalize">
                {payment.payment_method.replace('_', ' ')}
              </span>
            </div>
          )}

          {payment.razorpay_payment_id && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm text-gray-900">
                {payment.razorpay_payment_id}
              </span>
            </div>
          )}

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Order ID</span>
            <span className="font-mono text-sm text-gray-900">
              {payment.razorpay_order_id}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-600">Date</span>
            <span className="text-gray-900">
              {new Date(payment.captured_at || payment.created_at).toLocaleString()}
            </span>
          </div>

          {payment.invoice_number && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Invoice Number</span>
              <span className="font-semibold text-gray-900">{payment.invoice_number}</span>
            </div>
          )}

          {payment.status === 'failed' && (
            <div className="flex justify-between py-2 text-red-600">
              <span>Attempt</span>
              <span className="font-semibold">
                {payment.attempt_number} of {payment.max_attempts}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {payment.status === 'captured' && payment.invoice_id && (
          <Link
            href={`/api/invoices/${payment.invoice_id}/download`}
            className="flex-1 btn-primary flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
          </Link>
        )}

        {payment.status === 'failed' && canRetry && onRetry && (
          <button onClick={onRetry} className="flex-1 btn-primary flex items-center justify-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Retry Payment
          </button>
        )}

        {applicationId && (
          <Link
            href={`/dashboard/applications/${applicationId}`}
            className="flex-1 btn-outline flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Application
          </Link>
        )}

        {!applicationId && (
          <Link href="/dashboard" className="flex-1 btn-outline flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        )}
      </div>

      {/* Help Text */}
      {payment.status === 'captured' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            ✉️ A confirmation email with your invoice has been sent to your registered email address.
          </p>
        </div>
      )}

      {payment.status === 'failed' && canRetry && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-900">
            💡 <strong>Tip:</strong> Check your card balance and try again. If the problem persists,
            try a different payment method.
          </p>
        </div>
      )}

      {payment.status === 'failed' && !canRetry && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-900">
            ⚠️ Maximum retry attempts reached. Please contact support for assistance.
          </p>
        </div>
      )}
    </div>
  );
}

