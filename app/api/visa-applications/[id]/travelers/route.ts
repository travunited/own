/**
 * Travelers Management API Route
 * Add and manage travelers in application
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

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify application ownership
    const { data: application } = await supabase
      .from('visa_applications')
      .select('id, total_travelers')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Create traveler
    const { data: traveler, error } = await supabase
      .from('visa_travelers')
      .insert({
        application_id: id,
        ...body,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update total travelers count
    const { data: allTravelers } = await supabase
      .from('visa_travelers')
      .select('id')
      .eq('application_id', id);

    await supabase
      .from('visa_applications')
      .update({
        total_travelers: allTravelers?.length || 1,
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      traveler,
    });
  } catch (error) {
    console.error('Add traveler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get all travelers
    const { data: travelers, error } = await supabase
      .from('visa_travelers')
      .select('*')
      .eq('application_id', id)
      .order('is_primary', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      travelers: travelers || [],
    });
  } catch (error) {
    console.error('Get travelers error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

