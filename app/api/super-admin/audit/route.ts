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
    const action = searchParams.get('action') || 'all';
    const entityType = searchParams.get('entity_type') || 'all';
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const userId = searchParams.get('user_id');

    // Build query
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:user_profiles(full_name, email, role)
      `)
      .order('created_at', { ascending: false })
      .limit(500);

    if (action !== 'all') {
      query = query.eq('action', action);
    }

    if (entityType !== 'all') {
      query = query.eq('entity_type', entityType);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo + 'T23:59:59');
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    // Get action types for filter
    const { data: actionTypes } = await supabase
      .from('audit_logs')
      .select('action')
      .limit(1000);

    const uniqueActions = [...new Set(actionTypes?.map(a => a.action) || [])];

    return NextResponse.json({
      success: true,
      logs: logs || [],
      filters: {
        actions: uniqueActions,
        entityTypes: ['visa_application', 'payment', 'refund_request', 'user_profile', 'email_template'],
      },
    });
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

