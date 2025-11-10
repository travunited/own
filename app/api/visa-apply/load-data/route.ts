import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get('country_id');

    // Load active countries
    const { data: countries, error: countriesError } = await supabase
      .from('visa_countries')
      .select('*')
      .eq('is_active', true)
      .order('is_popular', { ascending: false })
      .order('name', { ascending: true });

    if (countriesError) throw countriesError;

    // Load visa types for selected country (if provided)
    let visaTypes = [];
    if (countryId) {
      const { data, error } = await supabase
        .from('visa_types')
        .select('*')
        .eq('country_id', countryId)
        .eq('is_active', true)
        .order('base_price', { ascending: true });
      
      if (error) throw error;
      visaTypes = data || [];
    }

    // Load add-ons
    const { data: addons, error: addonsError } = await supabase
      .from('visa_addons')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (addonsError) {
      console.error('Error loading addons:', addonsError);
      // Continue without addons if table doesn't exist
    }

    return NextResponse.json({
      success: true,
      countries: countries || [],
      visaTypes: visaTypes || [],
      addons: addons || [],
    });
  } catch (error: any) {
    console.error('Error loading visa data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load data' },
      { status: 500 }
    );
  }
}

