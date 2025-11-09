/**
 * Pending Documents API
 * Get all documents pending verification (Admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('preferences')
      .eq('id', user.id)
      .single();

    if (profile?.preferences?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get pending documents with application and traveler info
    const { data: documents, error, count } = await supabase
      .from('visa_application_documents')
      .select(`
        *,
        application:visa_applications(
          id,
          application_number,
          user_id,
          visa_type:visa_types(
            name,
            country:visa_countries(name)
          )
        ),
        traveler:visa_travelers(
          first_name,
          middle_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('verification_status', status)
      .order('uploaded_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      documents: documents || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get pending documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

