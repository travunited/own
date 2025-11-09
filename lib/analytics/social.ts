/**
 * Social Sharing Analytics
 * Track all share events and conversions
 */

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ShareEventData {
  platform: string;
  contentType: string;
  url: string;
  contentId?: string;
  referralCode?: string;
}

interface ReferralEventData {
  referralCode: string;
  referredUserId?: string;
  source?: string;
  campaign?: string;
}

/**
 * Track when content is shared
 */
export async function trackShareEvent(data: ShareEventData) {
  try {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Insert share event
    await supabase.from('social_shares').insert({
      user_id: user.id,
      platform: data.platform,
      content_type: data.contentType,
      content_id: data.contentId,
      url: data.url,
      referral_code: data.referralCode,
      shared_at: new Date().toISOString(),
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Share tracked:', data);
    }

    // Send to analytics (if integrated)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'share', {
        method: data.platform,
        content_type: data.contentType,
        content_id: data.contentId,
      });
    }
  } catch (error) {
    console.error('Error tracking share:', error);
  }
}

/**
 * Track referral click
 */
export async function trackReferralClick(data: ReferralEventData) {
  try {
    const supabase = createClientComponentClient();

    // Insert referral click
    await supabase.from('referral_clicks').insert({
      referral_code: data.referralCode,
      source: data.source || 'direct',
      campaign: data.campaign,
      clicked_at: new Date().toISOString(),
    });

    // Store in localStorage for later attribution
    if (typeof window !== 'undefined') {
      localStorage.setItem('referralCode', data.referralCode);
      localStorage.setItem('referralSource', data.source || 'direct');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Referral click tracked:', data);
    }
  } catch (error) {
    console.error('Error tracking referral click:', error);
  }
}

/**
 * Track referral conversion (signup/purchase)
 */
export async function trackReferralConversion(userId: string, orderValue?: number) {
  try {
    const supabase = createClientComponentClient();

    // Get referral code from localStorage
    const referralCode =
      typeof window !== 'undefined' ? localStorage.getItem('referralCode') : null;
    const referralSource =
      typeof window !== 'undefined' ? localStorage.getItem('referralSource') : null;

    if (!referralCode) return;

    // Get referrer user
    const { data: referrer } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single();

    if (!referrer) return;

    // Create referral record
    await supabase.from('referrals').insert({
      referrer_id: referrer.id,
      referred_user_id: userId,
      referral_code: referralCode,
      source: referralSource || 'direct',
      status: 'completed',
      conversion_value: orderValue || 0,
      completed_at: new Date().toISOString(),
    });

    // Calculate and award rewards
    await awardReferralRewards(referrer.id, userId, orderValue);

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('referralCode');
      localStorage.removeItem('referralSource');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Referral conversion tracked:', { referralCode, userId });
    }
  } catch (error) {
    console.error('Error tracking referral conversion:', error);
  }
}

/**
 * Award referral rewards to referrer and referee
 */
async function awardReferralRewards(
  referrerId: string,
  referredUserId: string,
  orderValue?: number
) {
  try {
    const supabase = createClientComponentClient();

    // Get referrer's current referral count
    const { count } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', referrerId)
      .eq('status', 'completed');

    // Tiered rewards
    let referrerReward = 500;
    if (count && count >= 16) {
      referrerReward = 1000; // Level 3
    } else if (count && count >= 6) {
      referrerReward = 750; // Level 2
    }

    const refereeReward = 500;

    // Award to referrer
    await supabase.from('wallet_transactions').insert({
      user_id: referrerId,
      type: 'credit',
      amount: referrerReward,
      description: 'Referral reward',
      status: 'completed',
    });

    // Award to referee (as discount or credit)
    await supabase.from('wallet_transactions').insert({
      user_id: referredUserId,
      type: 'credit',
      amount: refereeReward,
      description: 'Referral signup bonus',
      status: 'completed',
    });

    // Update referral record with reward amounts
    await supabase
      .from('referrals')
      .update({
        referrer_reward: referrerReward,
        referee_reward: refereeReward,
      })
      .eq('referrer_id', referrerId)
      .eq('referred_user_id', referredUserId);
  } catch (error) {
    console.error('Error awarding referral rewards:', error);
  }
}

/**
 * Get user's share statistics
 */
export async function getUserShareStats(userId: string) {
  try {
    const supabase = createClientComponentClient();

    // Get share count by platform
    const { data: shares } = await supabase
      .from('social_shares')
      .select('platform')
      .eq('user_id', userId);

    // Get referral statistics
    const { data: referrals, count: referralCount } = await supabase
      .from('referrals')
      .select('*', { count: 'exact' })
      .eq('referrer_id', userId);

    // Calculate total rewards earned
    const totalRewards =
      referrals?.reduce((sum, ref) => sum + (ref.referrer_reward || 0), 0) || 0;

    // Group shares by platform
    const sharesByPlatform = shares?.reduce((acc: any, share) => {
      acc[share.platform] = (acc[share.platform] || 0) + 1;
      return acc;
    }, {});

    return {
      totalShares: shares?.length || 0,
      sharesByPlatform: sharesByPlatform || {},
      totalReferrals: referralCount || 0,
      totalRewards,
      referrals: referrals || [],
    };
  } catch (error) {
    console.error('Error getting share stats:', error);
    return {
      totalShares: 0,
      sharesByPlatform: {},
      totalReferrals: 0,
      totalRewards: 0,
      referrals: [],
    };
  }
}

/**
 * Generate unique referral code for user
 */
export function generateReferralCode(name: string): string {
  const sanitized = name.toUpperCase().replace(/[^A-Z]/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${sanitized.substring(0, 4)}${random}`;
}

