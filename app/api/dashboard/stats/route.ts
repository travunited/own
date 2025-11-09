/**
 * User Dashboard Stats API
 * Get statistics for personal dashboard
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

    // Get application stats
    const { data: applications } = await supabase
      .from('visa_applications')
      .select('id, status, payment_status, created_at')
      .eq('user_id', user.id);

    const activeApplications = applications?.filter(
      (app) => !['approved', 'rejected', 'completed'].includes(app.status)
    ).length || 0;

    const completedApplications = applications?.filter(
      (app) => ['approved', 'completed'].includes(app.status)
    ).length || 0;

    // Get document stats
    const { data: documents } = await supabase
      .from('visa_application_documents')
      .select('verification_status')
      .in(
        'application_id',
        applications?.map((a) => a.id) || []
      );

    const pendingDocuments = documents?.filter(
      (doc) => doc.verification_status === 'pending'
    ).length || 0;

    // Get payment stats
    const { data: payments } = await supabase
      .from('payments')
      .select('amount, status')
      .eq('user_id', user.id)
      .eq('status', 'captured');

    const totalSpent = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get recent applications
    const { data: recentApplications } = await supabase
      .from('visa_applications')
      .select(`
        id,
        application_number,
        status,
        payment_status,
        created_at,
        visa_type:visa_types(
          name,
          country:visa_countries(name, flag_emoji)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get recent activities (from timeline)
    const { data: activities } = await supabase
      .from('visa_application_timeline')
      .select('*')
      .in(
        'application_id',
        applications?.map((a) => a.id) || []
      )
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        activeApplications,
        completedApplications,
        pendingDocuments,
        totalSpent,
      },
      applications: recentApplications || [],
      activities: activities || [],
      payments: payments || [],
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

