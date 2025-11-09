/**
 * Create Payment Order API
 * Creates Razorpay order with fresh pricing validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getRazorpayInstance } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Get application
    const { data: application, error: appError } = await supabase
      .from('visa_applications')
      .select(`
        *,
        visa_type:visa_types(id, name, price),
        travelers:visa_travelers(id)
      `)
      .eq('id', applicationId)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // 2. Verify ownership
    if (application.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 3. Check if application can be paid
    if (application.payment_status === 'paid') {
      return NextResponse.json({ error: 'Application already paid' }, { status: 400 });
    }

    // 4. Calculate fresh pricing
    const pricing = await calculatePricing(supabase, application);

    // 5. Create Razorpay order
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: pricing.total * 100, // convert to paise
      currency: 'INR',
      receipt: `visa_${applicationId}_${Date.now()}`,
      notes: {
        applicationId,
        userId: user.id,
        applicationNumber: application.application_number,
      },
    });

    // 6. Save payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        application_id: applicationId,
        user_id: user.id,
        razorpay_order_id: order.id,
        amount: pricing.total,
        currency: 'INR',
        status: 'pending',
        pricing_details: pricing,
        user_ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        user_agent: request.headers.get('user-agent'),
      })
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // 7. Return order details
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      pricing,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate pricing
async function calculatePricing(supabase: any, application: any) {
  const basePrice = application.visa_type.price || 0;
  const travelerCount = application.travelers?.length || 1;
  const totalVisaPrice = basePrice * travelerCount;

  // Get add-ons
  const { data: addons } = await supabase
    .from('visa_application_addons')
    .select('*, addon:visa_addons(*)')
    .eq('application_id', application.id);

  const addonsData =
    addons?.map((aa: any) => ({
      id: aa.addon.id,
      name: aa.addon.name,
      price: aa.addon.price,
      quantity: aa.addon.per_traveler ? travelerCount : 1,
      total: aa.addon.price * (aa.addon.per_traveler ? travelerCount : 1),
    })) || [];

  const addonsTotal = addonsData.reduce((sum: number, addon: any) => sum + addon.total, 0);

  // Processing fee (3%)
  const processingFee = Math.round((totalVisaPrice + addonsTotal) * 0.03);

  // Subtotal
  const subtotal = totalVisaPrice + addonsTotal + processingFee;

  // Tax (18% GST)
  const taxRate = 0.18;
  const taxAmount = Math.round(subtotal * taxRate);

  // Discount (TODO: implement discount system)
  const discountAmount = 0;

  // Total
  const total = subtotal + taxAmount - discountAmount;

  return {
    visaPrice: basePrice,
    travelerCount,
    totalVisaPrice,
    addons: addonsData,
    addonsTotal,
    processingFee,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    total,
    currency: 'INR',
  };
}

