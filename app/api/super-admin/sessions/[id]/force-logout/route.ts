import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// POST - Force logout a session (super admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    if (!userData || userData.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Super admin access required' },
        { status: 403 }
      );
    }
    
    // Force logout the session
    const { error: updateError } = await supabase
      .from('admin_sessions')
      .update({
        is_active: false,
        logout_at: new Date().toISOString(),
        logout_reason: 'forced',
      })
      .eq('id', id);
    
    if (updateError) {
      console.error('Error forcing logout:', updateError);
      return NextResponse.json(
        { error: 'Failed to force logout session' },
        { status: 500 }
      );
    }
    
    // Log the action in audit logs
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'force_logout_session',
      resource_type: 'admin_session',
      resource_id: id,
      changes: {
        forced_by: user.id,
        reason: 'Manual force logout by super admin',
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Session forced logout successfully',
    });
    
  } catch (error) {
    console.error('Force logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

