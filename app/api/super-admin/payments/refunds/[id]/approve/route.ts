import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Razorpay from 'razorpay';

// Initialize Razorpay
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured');
  }
  
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await params;
    
    // Check if user is super admin
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get refund request details
    const { data: refund, error: refundError } = await supabase
      .from('refund_requests')
      .select(`
        *,
        payment:payments(*)
      `)
      .eq('id', id)
      .single();

    if (refundError || !refund) {
      return NextResponse.json({ error: 'Refund request not found' }, { status: 404 });
    }

    if (refund.status !== 'pending') {
      return NextResponse.json({ error: 'Refund already processed' }, { status: 400 });
    }

    // Process refund through Razorpay
    try {
      const razorpay = getRazorpayInstance();
      
      // Create refund in Razorpay
      const razorpayRefund = await razorpay.payments.refund(refund.payment.razorpay_payment_id, {
        amount: refund.amount * 100, // Amount in paise
        notes: {
          refund_id: id,
          reason: refund.reason,
        },
      });

      // Update refund request status
      const { error: updateError } = await supabase
        .from('refund_requests')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: session.user.id,
          razorpay_refund_id: razorpayRefund.id,
          razorpay_refund_status: razorpayRefund.status,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Update payment status
      await supabase
        .from('payments')
        .update({ status: 'refunded' })
        .eq('id', refund.payment_id);

      // Log audit event
      await supabase.from('audit_logs').insert({
        user_id: session.user.id,
        action: 'refund_approved',
        entity_type: 'refund_request',
        entity_id: id,
        metadata: {
          amount: refund.amount,
          razorpay_refund_id: razorpayRefund.id,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Refund approved and processed',
        razorpay_refund: razorpayRefund,
      });
    } catch (razorpayError: any) {
      console.error('Razorpay refund error:', razorpayError);
      
      // Update refund status to failed
      await supabase
        .from('refund_requests')
        .update({
          status: 'failed',
          error_message: razorpayError.message,
        })
        .eq('id', id);

      return NextResponse.json(
        { error: `Razorpay error: ${razorpayError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error approving refund:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve refund' },
      { status: 500 }
    );
  }
}

