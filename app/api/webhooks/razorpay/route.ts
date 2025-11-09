/**
 * Razorpay Webhook Handler
 * Handles payment status updates from Razorpay
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    const body = await request.text();

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // 1. Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Parse event
    const event = JSON.parse(body);
    const supabase = createRouteHandlerClient({ cookies });

    // 3. Log webhook
    await supabase.from('payment_webhooks').insert({
      event_type: event.event,
      razorpay_event_id: event.event_id || `${event.event}_${Date.now()}`,
      payload: event,
      signature: signature,
      order_id: event.payload?.payment?.entity?.order_id || event.payload?.order?.entity?.id,
    });

    // 4. Handle event
    switch (event.event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(supabase, event.payload.payment.entity);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(supabase, event.payload.payment.entity);
        break;

      case 'payment.failed':
        await handlePaymentFailed(supabase, event.payload.payment.entity);
        break;

      case 'order.paid':
        await handleOrderPaid(supabase, event.payload.order.entity);
        break;

      case 'refund.created':
        await handleRefundCreated(supabase, event.payload.refund.entity);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    // 5. Mark webhook as processed
    await supabase
      .from('payment_webhooks')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
      })
      .eq('razorpay_event_id', event.event_id || `${event.event}_${Date.now()}`);

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Event handlers

async function handlePaymentAuthorized(supabase: any, paymentEntity: any) {
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('razorpay_order_id', paymentEntity.order_id)
    .single();

  if (!payment) return;

  await supabase
    .from('payments')
    .update({
      razorpay_payment_id: paymentEntity.id,
      status: 'authorized',
      payment_method: paymentEntity.method,
      payment_method_details: paymentEntity,
      authorized_at: new Date().toISOString(),
    })
    .eq('id', payment.id);
}

async function handlePaymentCaptured(supabase: any, paymentEntity: any) {
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('razorpay_order_id', paymentEntity.order_id)
    .single();

  if (!payment) return;

  // Update payment
  await supabase
    .from('payments')
    .update({
      razorpay_payment_id: paymentEntity.id,
      status: 'captured',
      payment_method: paymentEntity.method,
      payment_method_details: paymentEntity,
      captured_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  // Update application
  await supabase
    .from('visa_applications')
    .update({
      payment_status: 'paid',
      status: 'submitted',
    })
    .eq('id', payment.application_id);
}

async function handlePaymentFailed(supabase: any, paymentEntity: any) {
  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('razorpay_order_id', paymentEntity.order_id)
    .single();

  if (!payment) return;

  await supabase
    .from('payments')
    .update({
      razorpay_payment_id: paymentEntity.id,
      status: 'failed',
      payment_method: paymentEntity.method,
      failure_reason: paymentEntity.error_description,
      failure_code: paymentEntity.error_code,
      failed_at: new Date().toISOString(),
    })
    .eq('id', payment.id);

  // Add timeline event
  await supabase.from('visa_application_timeline').insert({
    application_id: payment.application_id,
    status: 'payment_failed',
    title: 'Payment Failed',
    description: paymentEntity.error_description || 'Payment processing failed',
    icon: 'x',
    is_system_generated: true,
    visible_to_user: true,
  });
}

async function handleOrderPaid(supabase: any, orderEntity: any) {
  // Additional confirmation
  console.log('Order paid:', orderEntity.id);
}

async function handleRefundCreated(supabase: any, refundEntity: any) {
  // Update refund status
  await supabase
    .from('refunds')
    .update({
      status: 'processed',
      processed_at: new Date().toISOString(),
    })
    .eq('razorpay_refund_id', refundEntity.id);

  // Update payment status
  await supabase
    .from('payments')
    .update({
      status: 'refunded',
    })
    .eq('razorpay_payment_id', refundEntity.payment_id);
}

