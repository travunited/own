/**
 * Auto-Save API Route
 * Save form progress automatically
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
    const { stepNumber, stepName, formData } = body;

    if (!stepNumber || !formData) {
      return NextResponse.json(
        { error: 'Step number and form data are required' },
        { status: 400 }
      );
    }

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
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Upsert auto-save data
    const { data: autoSave, error } = await supabase
      .from('visa_application_auto_saves')
      .upsert({
        application_id: id,
        user_id: user.id,
        step_number: stepNumber,
        step_name: stepName,
        form_data: formData,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'application_id,step_number'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update application last_saved_at
    await supabase
      .from('visa_applications')
      .update({
        last_saved_at: new Date().toISOString(),
        current_step: stepNumber,
      })
      .eq('id', id);

    return NextResponse.json({
      success: true,
      savedAt: autoSave.updated_at,
    });
  } catch (error) {
    console.error('Auto-save error:', error);
    return NextResponse.json(
      { error: 'Failed to save' },
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
    const searchParams = request.nextUrl.searchParams;
    const stepNumber = searchParams.get('step');

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let query = supabase
      .from('visa_application_auto_saves')
      .select('*')
      .eq('application_id', id)
      .eq('user_id', user.id);

    if (stepNumber) {
      query = query.eq('step_number', parseInt(stepNumber));
    }

    const { data: autoSaves, error } = await query;

    if (error) {
      throw error;
    }

    if (stepNumber && autoSaves?.length > 0) {
      return NextResponse.json({
        success: true,
        formData: autoSaves[0].form_data,
        savedAt: autoSaves[0].updated_at,
      });
    }

    return NextResponse.json({
      success: true,
      saves: autoSaves || [],
    });
  } catch (error) {
    console.error('Get auto-save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

