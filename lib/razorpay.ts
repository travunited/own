import Razorpay from 'razorpay';

// Lazy initialization of Razorpay instance (server-side only)
let razorpayInstance: Razorpay | null = null;

function getRazorpayInstance() {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });
  }
  return razorpayInstance;
}

// Types
export interface RazorpayOrderOptions {
  amount: number; // in paise (multiply by 100)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number | string;
  amount_paid: number | string;
  amount_due: number | string;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

export interface RazorpayPaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(
  options: RazorpayOrderOptions
): Promise<any> {
  try {
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: Math.round(options.amount * 100), // Convert to paise
      currency: options.currency,
      receipt: options.receipt,
      notes: options.notes,
    });

    return order;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
}

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature(data: RazorpayPaymentVerification): boolean {
  try {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    return generated_signature === razorpay_signature;
  } catch (error) {
    console.error('Error verifying payment signature:', error);
    return false;
  }
}

/**
 * Fetch payment details
 */
export async function fetchPayment(paymentId: string) {
  try {
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error('Error fetching payment:', error);
    throw error;
  }
}

/**
 * Create a refund
 */
export async function createRefund(paymentId: string, amount?: number) {
  try {
    const razorpay = getRazorpayInstance();
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? Math.round(amount * 100) : undefined,
    });
    return refund;
  } catch (error) {
    console.error('Error creating refund:', error);
    throw error;
  }
}

/**
 * Fetch refund details
 */
export async function fetchRefund(refundId: string) {
  try {
    const razorpay = getRazorpayInstance();
    const refund = await razorpay.refunds.fetch(refundId);
    return refund;
  } catch (error) {
    console.error('Error fetching refund:', error);
    throw error;
  }
}

/**
 * Client-side: Load Razorpay checkout script
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Client-side: Display Razorpay checkout
 */
export interface RazorpayCheckoutOptions {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  customerName: string;
  customerEmail: string;
  customerContact: string;
  onSuccess: (response: RazorpayPaymentVerification) => void;
  onFailure: (error: any) => void;
}

export async function displayRazorpayCheckout(options: RazorpayCheckoutOptions) {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    alert('Failed to load payment gateway. Please try again.');
    return;
  }

  const rzp = new (window as any).Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: Math.round(options.amount * 100),
    currency: options.currency,
    name: 'Travunited',
    description: options.description,
    order_id: options.orderId,
    prefill: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerContact,
    },
    theme: {
      color: '#2563eb', // Primary color
    },
    handler: function (response: RazorpayPaymentVerification) {
      options.onSuccess(response);
    },
    modal: {
      ondismiss: function () {
        options.onFailure({ message: 'Payment cancelled by user' });
      },
    },
  });

  rzp.on('payment.failed', function (response: any) {
    options.onFailure(response.error);
  });

  rzp.open();
}

