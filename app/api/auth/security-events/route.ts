/**
 * Security Events API Route
 * Get security event log for user
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const eventType = searchParams.get('eventType');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Build query
    let query = supabase
      .from('security_events')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (eventType) query = query.eq('event_type', eventType);
    if (category) query = query.eq('event_category', category);
    if (severity) query = query.eq('severity', severity);

    // Execute query with pagination
    const { data: events, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      events: events || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get security events error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

