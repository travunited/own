'use client';

import { useState } from 'react';
import { Trophy, Share2, Download, X } from 'lucide-react';
import ShareButton from './ShareButton';

interface AchievementShareProps {
  achievement: {
    id: string;
    type: string;
    name: string;
    description: string;
    badgeIcon: string;
    badgeColor: string;
    earnedAt: string;
  };
  userName: string;
  userStats?: {
    totalVisas?: number;
    totalTours?: number;
    countriesVisited?: number;
    totalSavings?: number;
  };
}

export default function AchievementShare({
  achievement,
  userName,
  userStats,
}: AchievementShareProps) {
  const [showCard, setShowCard] = useState(false);

  // Generate share message based on achievement type
  const getShareMessage = () => {
    const messages: Record<string, string> = {
      first_visa: `I got my first visa through Travunited! ✈️ The process was so easy and quick. Next destination, here I come!`,
      five_visas: `Visa Pro status unlocked! 🌟 Got 5 visas approved through Travunited. Travel made easy!`,
      ten_visas: `Travel Expert achievement! 🏆 10 visas and counting with Travunited. Making the world more accessible!`,
      first_tour: `My first adventure begins! 🎒 Booked an amazing tour through Travunited. Can't wait to explore!`,
      five_tours: `Explorer status unlocked! 🗺️ Completed 5 incredible tours with Travunited. Where to next?`,
      ten_countries: `World Traveler achievement! 🌍 Visited ${userStats?.countriesVisited || 10} countries. Travunited makes it possible!`,
      top_reviewer: `Top Reviewer badge earned! ⭐ Helped 100+ travelers with my reviews on Travunited.`,
      referral_master: `Referral Master! 🎁 Helped 10+ friends discover easy travel with Travunited.`,
      savings_master: `Smart Traveler! 💸 Saved ₹${userStats?.totalSavings?.toLocaleString('en-IN') || '10,000'} with Travunited!`,
    };

    return (
      messages[achievement.type] ||
      `Achievement unlocked: ${achievement.name}! Celebrating my travel milestones with Travunited! 🎉`
    );
  };

  const downloadCard = () => {
    // TODO: Implement canvas-based image generation
    alert('Download feature coming soon!');
  };

  return (
    <div className="space-y-4">
      {/* Achievement Card */}
      <div className="bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-lg">
            <span className="text-5xl">{achievement.badgeIcon}</span>
          </div>

          {/* Content */}
          <h2 className="text-3xl font-bold mb-2">Achievement Unlocked!</h2>
          <h3 className="text-2xl font-semibold mb-3 text-primary-100">
            {achievement.name}
          </h3>
          <p className="text-white/90 mb-6">{achievement.description}</p>

          {/* User Stats */}
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {userStats.totalVisas !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold">{userStats.totalVisas}</p>
                  <p className="text-sm text-white/80">Visas</p>
                </div>
              )}
              {userStats.totalTours !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold">{userStats.totalTours}</p>
                  <p className="text-sm text-white/80">Tours</p>
                </div>
              )}
              {userStats.countriesVisited !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold">{userStats.countriesVisited}</p>
                  <p className="text-sm text-white/80">Countries</p>
                </div>
              )}
              {userStats.totalSavings !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold">₹{(userStats.totalSavings / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-white/80">Saved</p>
                </div>
              )}
            </div>
          )}

          {/* Attribution */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Achieved by</p>
              <p className="font-bold text-lg">{userName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/80">Powered by</p>
              <p className="font-bold text-lg">Travunited</p>
            </div>
          </div>

          {/* Date */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm text-white/80">
              {new Date(achievement.earnedAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <ShareButton
          title={getShareMessage()}
          description={`I just unlocked the "${achievement.name}" achievement on Travunited! Join me in making travel easy!`}
          url="https://travunited.com"
          hashtags={['Travunited', 'TravelAchievement', achievement.name.replace(/\s+/g, '')]}
          variant="primary"
          className="w-full"
        />
        <button
          onClick={downloadCard}
          className="btn-outline w-full flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Card
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Share your achievement</strong> and inspire others! Get ₹100 wallet credit
          when you share on social media.
        </p>
      </div>
    </div>
  );
}

