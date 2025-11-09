/**
 * Retry Failed Payment API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getRazorpayInstance } from '@/lib/razorpay';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Get payment
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // 2. Verify ownership
    if (payment.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 3. Check if can retry
    if (payment.status !== 'failed') {
      return NextResponse.json({ error: 'Payment not failed' }, { status: 400 });
    }

    if (payment.attempt_number >= payment.max_attempts) {
      return NextResponse.json({ error: 'Maximum retry attempts reached' }, { status: 400 });
    }

    // Check cooldown (5 minutes)
    if (payment.last_retry_at) {
      const cooldownMs = 5 * 60 * 1000;
      const timeSinceLastRetry = Date.now() - new Date(payment.last_retry_at).getTime();
      if (timeSinceLastRetry < cooldownMs) {
        const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastRetry) / 1000);
        return NextResponse.json(
          { error: `Please wait ${remainingSeconds} seconds before retrying` },
          { status: 429 }
        );
      }
    }

    // 4. Get application and recalculate pricing
    const { data: application } = await supabase
      .from('visa_applications')
      .select(`
        *,
        visa_type:visa_types(id, name, price),
        travelers:visa_travelers(id)
      `)
      .eq('id', payment.application_id)
      .single();

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Recalculate pricing (may have changed)
    const pricing = await calculatePricing(supabase, application);

    // 5. Create new Razorpay order
    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: pricing.total * 100,
      currency: 'INR',
      receipt: `visa_${application.id}_retry_${payment.attempt_number + 1}`,
      notes: {
        applicationId: application.id,
        userId: user.id,
        retryAttempt: payment.attempt_number + 1,
      },
    });

    // 6. Update payment record
    const { error: updateError } = await supabase
      .from('payments')
      .update({
        razorpay_order_id: order.id,
        amount: pricing.total,
        pricing_details: pricing,
        status: 'pending',
        attempt_number: payment.attempt_number + 1,
        last_retry_at: new Date().toISOString(),
        failure_reason: null,
        failure_code: null,
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // 7. Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: payment.application_id,
      status: 'payment_retry',
      title: 'Payment Retry Initiated',
      description: `Payment retry attempt ${payment.attempt_number + 1} of ${payment.max_attempts}`,
      icon: 'refresh',
      is_system_generated: true,
      visible_to_user: true,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      pricing,
      attemptNumber: payment.attempt_number + 1,
    });
  } catch (error: any) {
    console.error('Retry payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function (same as create endpoint)
async function calculatePricing(supabase: any, application: any) {
  const basePrice = application.visa_type.price || 0;
  const travelerCount = application.travelers?.length || 1;
  const totalVisaPrice = basePrice * travelerCount;

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
  const processingFee = Math.round((totalVisaPrice + addonsTotal) * 0.03);
  const subtotal = totalVisaPrice + addonsTotal + processingFee;
  const taxRate = 0.18;
  const taxAmount = Math.round(subtotal * taxRate);
  const discountAmount = 0;
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

