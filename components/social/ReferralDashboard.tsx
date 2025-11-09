'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Users, Gift, TrendingUp, Share2 } from 'lucide-react';
import { getUserShareStats } from '@/lib/analytics/social';
import ShareModal from './ShareModal';

interface ReferralDashboardProps {
  userId: string;
  referralCode: string;
}

export default function ReferralDashboard({ userId, referralCode }: ReferralDashboardProps) {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const referralUrl = `https://travunited.com?ref=${referralCode}`;

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    try {
      const data = await getUserShareStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const rewardTier = stats?.totalReferrals >= 16 ? 3 : stats?.totalReferrals >= 6 ? 2 : 1;
  const rewardAmount = rewardTier === 3 ? 1000 : rewardTier === 2 ? 750 : 500;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Refer Friends, Earn Rewards!</h2>
        <p className="text-primary-100">
          Share your code and both you and your friend get ₹500. Win-win! 🎉
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalReferrals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-green-600">₹{stats?.totalRewards || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Shares</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalShares || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Tier</p>
              <p className="text-3xl font-bold text-primary-600">Level {rewardTier}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referral Code</h3>

        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Code</p>
              <p className="text-3xl font-bold text-primary-600">{referralCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="input-field flex-1 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share Your Code
        </button>
      </div>

      {/* Rewards Tier Info */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards Tiers</h3>

        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border-2 ${
              rewardTier === 1
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Level 1: Starter</p>
                <p className="text-sm text-gray-600">1-5 referrals</p>
              </div>
              <p className="text-lg font-bold text-gray-900">₹500/referral</p>
            </div>
            {rewardTier === 1 && (
              <div className="mt-2 text-sm text-primary-600">
                Current Level - {5 - (stats?.totalReferrals || 0)} more to Level 2!
              </div>
            )}
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              rewardTier === 2
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Level 2: Pro</p>
                <p className="text-sm text-gray-600">6-15 referrals</p>
              </div>
              <p className="text-lg font-bold text-gray-900">₹750/referral</p>
            </div>
            {rewardTier === 2 && (
              <div className="mt-2 text-sm text-primary-600">
                Current Level - {16 - (stats?.totalReferrals || 0)} more to Level 3!
              </div>
            )}
          </div>

          <div
            className={`p-4 rounded-lg border-2 ${
              rewardTier === 3
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Level 3: Master + VIP</p>
                <p className="text-sm text-gray-600">16+ referrals</p>
              </div>
              <p className="text-lg font-bold text-gray-900">₹1,000/referral</p>
            </div>
            {rewardTier === 3 && (
              <div className="mt-2 text-sm text-primary-600">
                🎉 Maximum Level Reached! Enjoy VIP perks!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-gray-900">Share Your Code</p>
              <p className="text-sm text-gray-600">
                Send your referral code to friends via WhatsApp, Email, or Social Media
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-gray-900">Friend Signs Up</p>
              <p className="text-sm text-gray-600">
                They use your code and get ₹500 discount on their first purchase
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-gray-900">You Get Rewarded</p>
              <p className="text-sm text-gray-600">
                Earn ₹{rewardAmount} credit when they make their first purchase
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <p className="font-semibold text-gray-900">Unlock Higher Tiers</p>
              <p className="text-sm text-gray-600">
                Refer more friends to unlock higher rewards (up to ₹1,000 per referral!)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          title="Join me on Travunited!"
          description={`Use my code ${referralCode} to get ₹500 off your first visa or tour booking!`}
          url={referralUrl}
          referralCode={referralCode}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}

