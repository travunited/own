/**
 * Approve Application API
 * Admin endpoint to approve visa application
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
    const { notes } = body;

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
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq('id', id);

    if (updateError) {
      throw updateError;
    }

    // Add admin note if provided
    if (notes) {
      await supabase.from('visa_application_notes').insert({
        application_id: id,
        admin_id: user.id,
        note: notes,
        note_type: 'approval',
      });
    }

    // Add timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: id,
      status: 'approved',
      title: 'Application Approved',
      description: notes || 'Your visa application has been approved',
      icon: 'check',
      is_system_generated: false,
      visible_to_user: true,
    });

    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action: 'approve_application',
      p_resource_type: 'visa_application',
      p_resource_id: id,
      p_details: { notes },
    });

    // TODO: Send email notification to user

    return NextResponse.json({
      success: true,
      message: 'Application approved successfully',
    });
  } catch (error: any) {
    console.error('Approve application error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

