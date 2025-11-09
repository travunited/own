/**
 * Super Admin - User Management API
 * List all users with filtering
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

    // Check if user is super admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized - Super Admin access required' }, { status: 403 });
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('user_profiles')
      .select(
        `
        *,
        auth_user:auth.users!id(email, created_at, last_sign_in_at)
      `,
        { count: 'exact' }
      );

    // Filter by role
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    // Search
    if (search) {
      query = query.or(
        `username.ilike.%${search}%,full_name.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    // Pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: userProfiles, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get additional stats
    const { data: roleStats } = await supabase
      .from('user_profiles')
      .select('role')
      .neq('role', 'user');

    const adminCount = roleStats?.length || 0;

    return NextResponse.json({
      success: true,
      users: userProfiles || [],
      total: count || 0,
      adminCount,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

