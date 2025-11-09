/**
 * Admin Applications List API
 * Get applications with filtering for admin
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
      .select('role, regional_access')
      .eq('id', user.id)
      .single();

    const userRole = profile?.role || 'user';

    if (!['admin', 'sub_admin', 'super_admin', 'regional_admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('visa_applications')
      .select(
        `
        id,
        application_number,
        status,
        payment_status,
        created_at,
        updated_at,
        user:user_profiles!user_id(id, username, full_name, email),
        visa_type:visa_types(
          name,
          country:visa_countries(name, flag_emoji)
        )
      `,
        { count: 'exact' }
      );

    // Filter by role
    if (userRole === 'sub_admin') {
      // TODO: Filter by assigned_to when field exists
      query = query.eq('assigned_to', user.id);
    } else if (userRole === 'regional_admin') {
      // TODO: Filter by region when field exists
      // query = query.in('region', profile.regional_access?.regions || []);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search
    if (search) {
      query = query.or(
        `application_number.ilike.%${search}%,user.email.ilike.%${search}%`
      );
    }

    // Pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: applications, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get document counts for each application
    const applicationIds = applications?.map((app) => app.id) || [];
    
    const { data: documentCounts } = await supabase
      .from('visa_application_documents')
      .select('application_id, verification_status')
      .in('application_id', applicationIds);

    // Calculate pending documents per application
    const pendingDocsMap: Record<string, number> = {};
    documentCounts?.forEach((doc) => {
      if (doc.verification_status === 'pending') {
        pendingDocsMap[doc.application_id] = (pendingDocsMap[doc.application_id] || 0) + 1;
      }
    });

    // Enhance applications with pending docs count
    const enhancedApplications = applications?.map((app) => ({
      ...app,
      pending_documents: pendingDocsMap[app.id] || 0,
    }));

    return NextResponse.json({
      success: true,
      applications: enhancedApplications || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Admin applications error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

