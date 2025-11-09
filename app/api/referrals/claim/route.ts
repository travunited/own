/**
 * Claim referral code from URL
 * POST /api/referrals/claim
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { referralCode, source = 'direct' } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Verify referral code exists
    const { data: referrer } = await supabase
      .from('user_profiles')
      .select('id, full_name, email')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Track referral click
    await supabase.from('referral_clicks').insert({
      referral_code: referralCode,
      source,
      clicked_at: new Date().toISOString(),
    });

    // Check if user is already logged in
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // User is logged in, check if they can use this referral
      if (user.id === referrer.id) {
        return NextResponse.json(
          { error: 'Cannot use your own referral code' },
          { status: 400 }
        );
      }

      // Check if user already used a referral
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_user_id', user.id)
        .single();

      if (existingReferral) {
        return NextResponse.json(
          { error: 'You have already used a referral code' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Referral code claimed successfully',
      referrer: {
        name: referrer.full_name,
      },
      discount: 500,
    });
  } catch (error: any) {
    console.error('Error claiming referral:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

