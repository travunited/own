/**
 * Admin Notes API
 * Add admin notes to application
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { note, noteType } = body;

    if (!note) {
      return NextResponse.json({ error: 'Note is required' }, { status: 400 });
    }

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

    if (!['admin', 'sub_admin', 'super_admin', 'regional_admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Add note
    const { data: noteData, error: noteError } = await supabase
      .from('visa_application_notes')
      .insert({
        application_id: id,
        admin_id: user.id,
        note,
        note_type: noteType || 'general',
      })
      .select()
      .single();

    if (noteError) {
      throw noteError;
    }

    // Add timeline event (if visible to user)
    if (noteType === 'user_visible') {
      await supabase.from('visa_application_timeline').insert({
        application_id: id,
        status: 'note_added',
        title: 'Admin Note Added',
        description: note,
        icon: 'message',
        is_system_generated: false,
        visible_to_user: true,
      });
    }

    // Log admin action
    await supabase.rpc('log_admin_action', {
      p_admin_id: user.id,
      p_action: 'add_note',
      p_resource_type: 'visa_application',
      p_resource_id: id,
      p_details: { note, noteType },
    });

    return NextResponse.json({
      success: true,
      note: noteData,
    });
  } catch (error: any) {
    console.error('Add note error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    if (!['admin', 'sub_admin', 'super_admin', 'regional_admin'].includes(profile?.role || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get notes
    const { data: notes, error } = await supabase
      .from('visa_application_notes')
      .select(`
        *,
        admin:user_profiles!admin_id(full_name, username)
      `)
      .eq('application_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      notes: notes || [],
    });
  } catch (error: any) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

