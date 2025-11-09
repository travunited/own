/**
 * Verify Payment API
 * Verifies Razorpay payment signature and updates payment status
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      // Invalid signature - mark payment as failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          failure_reason: 'Invalid payment signature',
          failed_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id);

      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Get payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('razorpay_order_id', razorpay_order_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // 3. Verify ownership
    if (payment.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 4. Update payment status
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured',
        captured_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    if (updateError) {
      throw updateError;
    }

    // 5. Update application status
    await supabase
      .from('visa_applications')
      .update({
        payment_status: 'paid',
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', payment.application_id);

    // 6. Generate invoice
    const invoice = await generateInvoice(supabase, payment);

    // 7. Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: payment.application_id,
      status: 'payment_successful',
      title: 'Payment Received',
      description: `Payment of ₹${payment.amount / 100} received successfully. Transaction ID: ${razorpay_payment_id}`,
      icon: 'check',
      is_system_generated: true,
      visible_to_user: true,
    });

    // 8. TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate invoice
async function generateInvoice(supabase: any, payment: any) {
  // Generate invoice number
  const { data: invoiceNumberData } = await supabase.rpc('generate_invoice_number');
  const invoiceNumber = invoiceNumberData;

  const pricing = payment.pricing_details;

  // Prepare line items
  const lineItems = [
    {
      description: `Visa Fee (${pricing.travelerCount} traveler${pricing.travelerCount > 1 ? 's' : ''})`,
      quantity: pricing.travelerCount,
      unitPrice: pricing.visaPrice,
      total: pricing.totalVisaPrice,
    },
    ...pricing.addons.map((addon: any) => ({
      description: addon.name,
      quantity: addon.quantity,
      unitPrice: addon.price,
      total: addon.total,
    })),
    {
      description: 'Processing Fee',
      quantity: 1,
      unitPrice: pricing.processingFee,
      total: pricing.processingFee,
    },
  ];

  // Company details
  const companyDetails = {
    name: 'Travunited',
    address: 'Your Company Address',
    phone: '+91 1234567890',
    email: 'support@travunited.com',
    gstin: 'YOUR_GSTIN',
  };

  // Customer details (TODO: get from user profile)
  const customerDetails = {
    name: 'Customer Name',
    email: 'customer@example.com',
    phone: '+91 9876543210',
  };

  // Create invoice
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      payment_id: payment.id,
      application_id: payment.application_id,
      user_id: payment.user_id,
      invoice_number: invoiceNumber,
      invoice_date: new Date().toISOString().split('T')[0],
      subtotal: pricing.subtotal,
      tax_amount: pricing.taxAmount,
      discount_amount: pricing.discountAmount,
      total_amount: pricing.total,
      line_items: lineItems,
      status: 'paid',
      company_details: companyDetails,
      customer_details: customerDetails,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return invoice;
}

