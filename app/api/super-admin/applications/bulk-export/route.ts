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
    const { application_ids, fields } = body;

    if (!application_ids || !Array.isArray(application_ids) || application_ids.length === 0) {
      return NextResponse.json({ error: 'Invalid application IDs' }, { status: 400 });
    }

    // Fetch selected applications with all details
    const { data: applications, error } = await supabase
      .from('visa_applications')
      .select(`
        *,
        user:user_profiles(full_name, email, phone),
        country:visa_countries(name),
        visa_type:visa_types(name),
        travelers:visa_application_travelers(*)
      `)
      .in('id', application_ids);

    if (error) throw error;

    // Format data for export
    const exportData = applications?.map((app) => ({
      'Application Number': app.application_number,
      'User Name': app.user?.full_name || 'N/A',
      'Email': app.user?.email || 'N/A',
      'Phone': app.user?.phone || 'N/A',
      'Country': app.country?.name || 'N/A',
      'Visa Type': app.visa_type?.name || 'N/A',
      'Status': app.status,
      'Payment Status': app.payment_status,
      'Travelers': app.travelers?.length || 0,
      'Travel Date': app.travel_date ? new Date(app.travel_date).toLocaleDateString() : 'N/A',
      'Created At': new Date(app.created_at).toLocaleDateString(),
      'Updated At': new Date(app.updated_at).toLocaleDateString(),
    }));

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'bulk_export',
      entity_type: 'visa_application',
      metadata: {
        bulk_operation: true,
        total_count: application_ids.length,
        fields: fields || 'all',
      },
    });

    return NextResponse.json({
      success: true,
      data: exportData,
      count: exportData?.length || 0,
    });
  } catch (error: any) {
    console.error('Error bulk exporting applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export applications' },
      { status: 500 }
    );
  }
}

