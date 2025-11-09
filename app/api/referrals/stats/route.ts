/**
 * Get user's referral statistics
 * GET /api/referrals/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get user profile with referral code
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    if (!profile?.referral_code) {
      return NextResponse.json({ error: 'Referral code not found' }, { status: 404 });
    }

    // Get referral statistics
    const { data: referrals, count: totalReferrals } = await supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('referrer_id', user.id)
      .eq('status', 'completed');

    // Calculate total earnings
    const totalEarnings =
      referrals?.reduce((sum, ref) => sum + (ref.referrer_reward || 0), 0) || 0;

    // Get pending rewards
    const pendingRewards = referrals?.filter((ref) => !ref.rewarded_at).length || 0;

    // Get share count
    const { count: totalShares } = await supabase
      .from('social_shares')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get shares by platform
    const { data: shares } = await supabase
      .from('social_shares')
      .select('platform')
      .eq('user_id', user.id);

    const sharesByPlatform = shares?.reduce((acc: any, share) => {
      acc[share.platform] = (acc[share.platform] || 0) + 1;
      return acc;
    }, {});

    // Calculate current tier
    const tier =
      (totalReferrals || 0) >= 16 ? 3 : (totalReferrals || 0) >= 6 ? 2 : 1;

    // Get recent referrals
    const { data: recentReferrals } = await supabase
      .from('referrals')
      .select(`
        *,
        referred_user:user_profiles!referred_user_id(full_name, email)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      stats: {
        referralCode: profile.referral_code,
        totalReferrals: totalReferrals || 0,
        totalEarnings,
        pendingRewards,
        totalShares: totalShares || 0,
        sharesByPlatform: sharesByPlatform || {},
        tier,
        rewardPerReferral: tier === 3 ? 1000 : tier === 2 ? 750 : 500,
        recentReferrals: recentReferrals || [],
      },
    });
  } catch (error: any) {
    console.error('Error getting referral stats:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

