import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Get all admin sessions (super admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check if user is super admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (!userData || userData.role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Super admin access required' },
        { status: 403 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('is_active');
    const dashboardType = searchParams.get('dashboard_type');
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Build query
    let query = supabase
      .from('admin_sessions')
      .select(`
        *,
        user:users!admin_sessions_user_id_fkey(
          id,
          email,
          full_name,
          role
        )
      `, { count: 'exact' });
    
    // Apply filters
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    if (dashboardType) {
      query = query.eq('dashboard_type', dashboardType);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    // Apply pagination
    query = query
      .order('login_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data: sessions, error: sessionsError, count } = await query;
    
    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json(
        { error: 'Failed to fetch sessions' },
        { status: 500 }
      );
    }
    
    // Get statistics
    const { data: stats } = await supabase.rpc('get_session_stats');
    
    return NextResponse.json({
      success: true,
      sessions: sessions,
      total: count,
      limit: limit,
      offset: offset,
      stats: stats || {},
    });
    
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

