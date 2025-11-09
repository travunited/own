import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await params;
    
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
    const { name, code, flag, continent, processing_time, is_popular, is_active } = body;

    // Update country
    const { data: country, error } = await supabase
      .from('visa_countries')
      .update({
        name,
        code,
        flag,
        continent,
        processing_time,
        is_popular,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'country_updated',
      entity_type: 'visa_country',
      entity_id: id,
      metadata: { name, code },
    });

    return NextResponse.json({
      success: true,
      country,
    });
  } catch (error: any) {
    console.error('Error updating country:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update country' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = await params;
    
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

    // Delete country (soft delete by setting is_active = false)
    const { error } = await supabase
      .from('visa_countries')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'country_deleted',
      entity_type: 'visa_country',
      entity_id: id,
    });

    return NextResponse.json({
      success: true,
      message: 'Country deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting country:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete country' },
      { status: 500 }
    );
  }
}

