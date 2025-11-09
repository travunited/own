import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
    const { application_ids } = body;

    if (!application_ids || !Array.isArray(application_ids) || application_ids.length === 0) {
      return NextResponse.json({ error: 'Invalid application IDs' }, { status: 400 });
    }

    // Update all selected applications
    const { data, error } = await supabase
      .from('visa_applications')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      .in('id', application_ids)
      .select();

    if (error) throw error;

    // Log audit event for each application
    const auditLogs = application_ids.map((id) => ({
      user_id: session.user.id,
      action: 'bulk_approve',
      entity_type: 'visa_application',
      entity_id: id,
      metadata: {
        bulk_operation: true,
        total_count: application_ids.length,
      },
    }));

    await supabase.from('audit_logs').insert(auditLogs);

    // TODO: Send approval emails to users

    return NextResponse.json({
      success: true,
      message: `${application_ids.length} applications approved successfully`,
      count: application_ids.length,
    });
  } catch (error: any) {
    console.error('Error bulk approving applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve applications' },
      { status: 500 }
    );
  }
}

