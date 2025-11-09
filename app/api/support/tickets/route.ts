/**
 * Support Tickets API
 * Create and list support tickets
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, description, category, priority, applicationId, bookingId } = body;

    if (!subject || !description || !category) {
      return NextResponse.json(
        { error: 'Subject, description, and category are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Generate ticket number
    const { data: ticketNumber } = await supabase.rpc('generate_ticket_number');

    // Create ticket
    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        ticket_number: ticketNumber,
        subject,
        description,
        category,
        priority: priority || 'medium',
        status: 'open',
        application_id: applicationId,
        booking_id: bookingId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // TODO: Send email notification to support team

    return NextResponse.json({
      success: true,
      ticket,
    });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = ['super_admin', 'admin', 'sub_admin'].includes(profile?.role || '');

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    // Build query
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        user:user_profiles!user_id(full_name, email),
        assigned_to_user:user_profiles!assigned_to(full_name)
      `);

    // Filter by user if not admin
    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    // Filter by status
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    query = query.order('created_at', { ascending: false }).limit(50);

    const { data: tickets, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      tickets: tickets || [],
    });
  } catch (error: any) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

