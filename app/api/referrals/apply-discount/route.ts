/**
 * Apply referral discount to order
 * POST /api/referrals/apply-discount
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { referralCode, orderAmount } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
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

    // Get referrer by code
    const { data: referrer } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 404 }
      );
    }

    // Check self-referral
    if (referrer.id === user.id) {
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
      .eq('status', 'completed');

    if (existingReferral && existingReferral.length > 0) {
      return NextResponse.json(
        { error: 'Referral discount already used' },
        { status: 400 }
      );
    }

    // Calculate discount (₹500 or 10%, whichever is less)
    const maxDiscount = 500;
    const percentageDiscount = Math.floor(orderAmount * 0.1);
    const discountAmount = Math.min(maxDiscount, percentageDiscount);

    // Create pending referral record
    const { data: referral, error: referralError } = await supabase
      .from('referrals')
      .insert({
        referrer_id: referrer.id,
        referred_user_id: user.id,
        referral_code: referralCode,
        status: 'pending',
        referee_reward: discountAmount,
        conversion_value: orderAmount,
      })
      .select()
      .single();

    if (referralError) {
      throw referralError;
    }

    return NextResponse.json({
      success: true,
      discount: discountAmount,
      referrer: {
        name: referrer.full_name,
      },
      message: `₹${discountAmount} discount applied from ${referrer.full_name}'s referral`,
    });
  } catch (error: any) {
    console.error('Error applying discount:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

