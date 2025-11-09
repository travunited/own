/**
 * Admin Dashboard Stats API
 * Get statistics for admin dashboard
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
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

    const userRole = profile?.role || 'user';

    if (!['admin', 'sub_admin', 'super_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get application stats
    let applicationsQuery = supabase
      .from('visa_applications')
      .select('id, status, payment_status, created_at');

    // Filter by assignment for sub_admin
    if (userRole === 'sub_admin') {
      // TODO: Filter by assigned_to when that field exists
      applicationsQuery = applicationsQuery.eq('assigned_to', user.id);
    }

    const { data: applications } = await applicationsQuery;

    const pendingReview = applications?.filter(
      (app) => app.status === 'under_review' || app.status === 'documents_submitted'
    ).length || 0;

    const approvedToday = applications?.filter((app) => {
      const today = new Date().toDateString();
      const createdDate = new Date(app.created_at).toDateString();
      return app.status === 'approved' && createdDate === today;
    }).length || 0;

    // Get document stats
    const { data: documents, count: documentsToVerify } = await supabase
      .from('visa_application_documents')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending');

    // Get support ticket stats (TODO: when support system built)
    const supportTickets = 0; // Placeholder

    // Get recent applications
    const { data: recentApplications } = await supabase
      .from('visa_applications')
      .select(`
        id,
        application_number,
        status,
        payment_status,
        created_at,
        user:user_profiles(username, full_name, email),
        visa_type:visa_types(
          name,
          country:visa_countries(name, flag_emoji)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        pendingReview,
        documentsToVerify: documentsToVerify || 0,
        supportTickets,
        approvedToday,
      },
      applications: recentApplications || [],
    });
  } catch (error: any) {
    console.error('Admin dashboard stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

