/**
 * Complete referral and award rewards
 * POST /api/referrals/complete
 * Called after successful payment
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderAmount } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Find pending referral for this user
    const { data: referral } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!referral) {
      // No referral to complete
      return NextResponse.json({
        success: true,
        message: 'No referral to complete',
      });
    }

    // Get referrer's current referral count to determine tier
    const { count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', referral.referrer_id)
      .eq('status', 'completed');

    // Calculate referrer reward based on tier
    let referrerReward = 500;
    if ((referralCount || 0) >= 16) {
      referrerReward = 1000; // Level 3
    } else if ((referralCount || 0) >= 6) {
      referrerReward = 750; // Level 2
    }

    // Update referral to completed
    await supabase
      .from('referrals')
      .update({
        status: 'completed',
        referrer_reward: referrerReward,
        conversion_value: orderAmount,
        completed_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    // Award referrer
    await supabase.from('wallet_transactions').insert({
      user_id: referral.referrer_id,
      type: 'credit',
      amount: referrerReward,
      description: `Referral reward - ${user.email}`,
      reference_type: 'referral',
      reference_id: referral.id,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    // Award referee (if they haven't received welcome bonus)
    const { data: existingBonus } = await supabase
      .from('wallet_transactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('description', 'Referral signup bonus')
      .single();

    if (!existingBonus) {
      await supabase.from('wallet_transactions').insert({
        user_id: user.id,
        type: 'credit',
        amount: 100,
        description: 'Referral signup bonus',
        reference_type: 'referral',
        reference_id: referral.id,
        status: 'completed',
        completed_at: new Date().toISOString(),
      });
    }

    // Mark referral as rewarded
    await supabase
      .from('referrals')
      .update({
        rewarded_at: new Date().toISOString(),
      })
      .eq('id', referral.id);

    // Send notification emails (via email service)
    // TODO: Implement email notifications

    return NextResponse.json({
      success: true,
      referrerReward,
      refereeBonus: 100,
      message: 'Referral completed and rewards awarded',
    });
  } catch (error: any) {
    console.error('Error completing referral:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

