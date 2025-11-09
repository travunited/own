/**
 * Reject Application API
 * Admin endpoint to reject visa application
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
    const { reason, notes } = body;

    if (!reason) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!['admin', 'super_admin', 'regional_admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get application
    const { data: application, error: appError } = await supabase
      .from('visa_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('visa_applications')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
        rejected_by: user.id,
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // Add admin note
    await supabase.from('visa_application_notes').insert({
      application_id: id,
      admin_id: user.id,
      note: notes || reason,
      note_type: 'rejection',
    });

    // Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: id,
      status: 'rejected',
      title: 'Application Rejected',
      description: reason,
      icon: 'x',
      is_system_generated: false,
      visible_to_user: true,
    });

    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action: 'reject_application',
      p_resource_type: 'visa_application',
      p_resource_id: id,
      p_details: { reason, notes },
    });

    // TODO: Send email notification to user

    return NextResponse.json({
      success: true,
      message: 'Application rejected',
    });
  } catch (error: any) {
    console.error('Reject application error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

