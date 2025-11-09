/**
 * Get Payment Details API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
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

    // Get payment
    const { data: payment, error } = await supabase
      .from('payments')
      .select(`
        *,
        application:visa_applications(
          id,
          application_number
        ),
        invoice:invoices(*)
      `)
      .eq('id', id)
      .single();

    if (error || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Check ownership or admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.preferences?.role === 'admin';
    const isOwner = payment.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if payment can be retried
    const canRetry = payment.status === 'failed' && payment.attempt_number < payment.max_attempts;
    const remainingAttempts = payment.max_attempts - payment.attempt_number;

    return NextResponse.json({
      success: true,
      payment,
      canRetry,
      remainingAttempts,
    });
  } catch (error: any) {
    console.error('Get payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

