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
    const { application_ids, admin_id } = body;

    if (!application_ids || !Array.isArray(application_ids) || application_ids.length === 0) {
      return NextResponse.json({ error: 'Invalid application IDs' }, { status: 400 });
    }

    if (!admin_id) {
      return NextResponse.json({ error: 'Admin ID is required' }, { status: 400 });
    }

    // Verify the admin exists and has appropriate role
    const { data: adminProfile } = await supabase
      .from('user_profiles')
      .select('id, full_name, role')
      .eq('id', admin_id)
      .single();

    if (!adminProfile || !['admin', 'sub_admin'].includes(adminProfile.role)) {
      return NextResponse.json({ error: 'Invalid admin user' }, { status: 400 });
    }

    // Update all selected applications
    const { data, error } = await supabase
      .from('visa_applications')
      .update({
        assigned_to: admin_id,
        status: 'under_review',
        updated_at: new Date().toISOString(),
      })
      .in('id', application_ids)
      .select();

    if (error) throw error;

    // Log audit event
    const auditLogs = application_ids.map((id) => ({
      user_id: session.user.id,
      action: 'bulk_assign',
      entity_type: 'visa_application',
      entity_id: id,
      metadata: {
        bulk_operation: true,
        assigned_to: admin_id,
        admin_name: adminProfile.full_name,
        total_count: application_ids.length,
      },
    }));

    await supabase.from('audit_logs').insert(auditLogs);

    // TODO: Send notification to assigned admin

    return NextResponse.json({
      success: true,
      message: `${application_ids.length} applications assigned to ${adminProfile.full_name}`,
      count: application_ids.length,
    });
  } catch (error: any) {
    console.error('Error bulk assigning applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign applications' },
      { status: 500 }
    );
  }
}

