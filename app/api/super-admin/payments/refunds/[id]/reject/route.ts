import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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

    const body = await request.json();
    const { rejection_reason } = body;

    // Get refund request
    const { data: refund, error: refundError } = await supabase
      .from('refund_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (refundError || !refund) {
      return NextResponse.json({ error: 'Refund request not found' }, { status: 404 });
    }

    if (refund.status !== 'pending') {
      return NextResponse.json({ error: 'Refund already processed' }, { status: 400 });
    }

    // Update refund status to rejected
    const { error: updateError } = await supabase
      .from('refund_requests')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
        rejected_by: session.user.id,
        rejection_reason: rejection_reason || 'No reason provided',
      })
      .eq('id', id);

    if (updateError) throw updateError;

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'refund_rejected',
      entity_type: 'refund_request',
      entity_id: id,
      metadata: {
        amount: refund.amount,
        reason: rejection_reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Refund request rejected',
    });
  } catch (error: any) {
    console.error('Error rejecting refund:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject refund' },
      { status: 500 }
    );
  }
}

