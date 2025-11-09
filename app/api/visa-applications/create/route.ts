/**
 * Create Visa Application API Route
 * Initialize a new visa application
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visaTypeId, processingSpeed = 'standard' } = body;

    if (!visaTypeId) {
      return NextResponse.json(
        { error: 'Visa type ID is required' },
        { status: 400 }
      );
    }

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

    // Get visa type details
    const { data: visaType, error: visaError } = await supabase
      .from('visa_types')
      .select('*, country:visa_countries(*)')
      .eq('id', visaTypeId)
      .single();

    if (visaError || !visaType) {
      return NextResponse.json(
        { error: 'Visa type not found' },
        { status: 404 }
      );
    }

    // Generate application number
    const { data: appNumberData } = await supabase
      .rpc('generate_application_number');

    const applicationNumber = appNumberData || `TVU-${Date.now()}`;

    // Calculate fees
    const governmentFee = visaType.government_fee || 0;
    const serviceFee = visaType.service_fee || 0;
    const totalAmount = governmentFee + serviceFee;

    // Create application
    const { data: application, error: createError } = await supabase
      .from('visa_applications')
      .insert({
        application_number: applicationNumber,
        user_id: user.id,
        visa_type_id: visaTypeId,
        status: 'draft',
        completion_percentage: 11, // First step complete
        government_fee: governmentFee,
        service_fee: serviceFee,
        total_amount: totalAmount,
        processing_speed: processingSpeed,
        is_draft: true,
        current_step: 1,
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Create initial timeline event
    await supabase.from('visa_application_timeline').insert({
      application_id: application.id,
      status: 'draft',
      title: 'Application Started',
      description: `Started application for ${visaType.country.name} ${visaType.name}`,
      icon: 'file',
      is_system_generated: true,
      visible_to_user: true,
    });

    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        applicationNumber: application.application_number,
        visaType: {
          id: visaType.id,
          name: visaType.name,
          country: visaType.country.name,
        },
      },
    });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

