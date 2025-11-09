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

    // Fetch all countries with visa types count
    const { data: countries, error } = await supabase
      .from('visa_countries')
      .select(`
        *,
        visa_types:visa_types(count)
      `)
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      countries: countries || [],
    });
  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch countries' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const { name, code, flag, continent, processing_time, is_popular, is_active } = body;

    // Create new country
    const { data: country, error } = await supabase
      .from('visa_countries')
      .insert({
        name,
        code,
        flag,
        continent,
        processing_time,
        is_popular: is_popular || false,
        is_active: is_active !== false,
      })
      .select()
      .single();

    if (error) throw error;

    // Log audit event
    await supabase.from('audit_logs').insert({
      user_id: session.user.id,
      action: 'country_created',
      entity_type: 'visa_country',
      entity_id: country.id,
      metadata: { name, code },
    });

    return NextResponse.json({
      success: true,
      country,
    });
  } catch (error: any) {
    console.error('Error creating country:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create country' },
      { status: 500 }
    );
  }
}

