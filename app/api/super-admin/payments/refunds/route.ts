import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // Fetch refund requests
    let query = supabase
      .from('refund_requests')
      .select(`
        *,
        payment:payments(
          id,
          amount,
          razorpay_payment_id,
          razorpay_order_id,
          application:visa_applications(
            application_number,
            user:user_profiles(full_name, email)
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: refunds, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      refunds: refunds || [],
    });
  } catch (error: any) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
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

    const body = await request.json();
    const { payment_id, reason, amount } = body;

    // Get payment details
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', payment_id)
      .single();

    if (paymentError || !payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Create refund request
    const { data: refundRequest, error: refundError } = await supabase
      .from('refund_requests')
      .insert({
        payment_id,
        user_id: payment.user_id,
        amount: amount || payment.amount,
        reason,
        status: 'pending',
        requested_by: session.user.id,
      })
      .select()
      .single();

    if (refundError) throw refundError;

    return NextResponse.json({
      success: true,
      refund: refundRequest,
    });
  } catch (error: any) {
    console.error('Error creating refund request:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create refund request' },
      { status: 500 }
    );
  }
}

