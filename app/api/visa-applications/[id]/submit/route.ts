/**
 * Submit Visa Application API Route
 * Finalize and submit application after payment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentId, razorpayOrderId, razorpayPaymentId } = body;

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get application
    const { data: application, error: appError } = await supabase
      .from('visa_applications')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if already submitted
    if (!application.is_draft) {
      return NextResponse.json(
        { error: 'Application already submitted' },
        { status: 400 }
      );
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('visa_applications')
      .update({
        status: 'submitted',
        is_draft: false,
        submitted_at: new Date().toISOString(),
        payment_status: 'paid',
        payment_id: paymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        paid_at: new Date().toISOString(),
        completion_percentage: 100,
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: id,
      status: 'submitted',
      title: 'Application Submitted',
      description: 'Your application has been submitted successfully and payment confirmed',
      icon: 'check',
      is_system_generated: true,
      visible_to_user: true,
    });

    // TODO: Send confirmation email
    // TODO: Notify admin team

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationNumber: application.application_number,
    });
  } catch (error) {
    console.error('Submit application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

