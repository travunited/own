/**
 * Tour Booking API
 * Create tour booking
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
    const {
      travelDate,
      returnDate,
      numberOfTravelers,
      leadTraveler,
      travelers,
      customizations,
      specialRequests,
    } = body;

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get tour details
    const { data: tour, error: tourError } = await supabase
      .from('tour_packages')
      .select('*')
      .eq('id', id)
      .single();

    if (tourError || !tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
    }

    // Calculate pricing
    const basePrice = tour.price * numberOfTravelers;
    const customizationCost = 0; // TODO: Calculate based on customizations
    const totalAmount = basePrice + customizationCost;

    // Generate booking number
    const { data: bookingNumber } = await supabase.rpc('generate_booking_number');

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('tour_bookings')
      .insert({
        user_id: user.id,
        tour_id: id,
        booking_number: bookingNumber,
        travel_date: travelDate,
        return_date: returnDate,
        number_of_travelers: numberOfTravelers,
        lead_traveler_name: `${leadTraveler.firstName} ${leadTraveler.lastName}`,
        lead_traveler_email: leadTraveler.email,
        lead_traveler_phone: leadTraveler.phone,
        base_price: basePrice,
        total_amount: totalAmount,
        customizations: customizations || {},
        special_requests: specialRequests,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Add travelers
    if (travelers && travelers.length > 0) {
      const travelersData = travelers.map((traveler: any, index: number) => ({
        booking_id: booking.id,
        first_name: traveler.firstName,
        middle_name: traveler.middleName,
        last_name: traveler.lastName,
        date_of_birth: traveler.dateOfBirth,
        gender: traveler.gender,
        passport_number: traveler.passportNumber,
        passport_expiry: traveler.passportExpiry,
        email: index === 0 ? leadTraveler.email : traveler.email,
        phone: index === 0 ? leadTraveler.phone : traveler.phone,
        traveler_type: traveler.type || 'adult',
        is_lead: index === 0,
      }));

      await supabase.from('tour_booking_travelers').insert(travelersData);
    }

    return NextResponse.json({
      success: true,
      booking,
      bookingNumber,
    });
  } catch (error: any) {
    console.error('Tour booking error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

