"use client";

import { Award, Lock, TrendingUp, Star, Trophy, Target } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'skill' | 'collaboration' | 'milestone' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedAt?: string;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}

interface BadgeSystemProps {
  badges: Badge[];
  totalXP: number;
  currentLevel: number;
  nextLevelXP: number;
  userRank: number;
  totalUsers: number;
}

export default function BadgeSystem({
  badges,
  totalXP,
  currentLevel,
  nextLevelXP,
  userRank,
  totalUsers
}: BadgeSystemProps) {
  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-yellow-600';
      case 'epic':
        return 'bg-gradient-to-br from-purple-400 to-pink-500 text-white border-purple-600';
      case 'rare':
        return 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white border-blue-600';
      case 'common':
        return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white border-gray-600';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const getCategoryIcon = (category: Badge['category']) => {
    switch (category) {
      case 'achievement':
        return <Trophy className="w-4 h-4" />;
      case 'skill':
        return <Star className="w-4 h-4" />;
      case 'collaboration':
        return <Award className="w-4 h-4" />;
      case 'milestone':
        return <Target className="w-4 h-4" />;
      case 'streak':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Badge['category']) => {
    switch (category) {
      case 'achievement':
        return 'bg-warning-100 text-warning-600';
      case 'skill':
        return 'bg-primary-100 text-primary-600';
      case 'collaboration':
        return 'bg-success-100 text-success-600';
      case 'milestone':
        return 'bg-info-100 text-info-600';
      case 'streak':
        return 'bg-error-100 text-error-600';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const progressToNextLevel = ((totalXP % nextLevelXP) / nextLevelXP) * 100;

  const categories = [
    { id: 'all', label: 'All Badges', count: badges.length },
    { id: 'earned', label: 'Earned', count: earnedBadges.length },
    { id: 'achievement', label: 'Achievements', count: badges.filter(b => b.category === 'achievement').length },
    { id: 'skill', label: 'Skills', count: badges.filter(b => b.category === 'skill').length },
    { id: 'collaboration', label: 'Collaboration', count: badges.filter(b => b.category === 'collaboration').length },
    { id: 'milestone', label: 'Milestones', count: badges.filter(b => b.category === 'milestone').length },
    { id: 'streak', label: 'Streaks', count: badges.filter(b => b.category === 'streak').length },
  ];

  return (
    <div className="space-y-6">
      {/* User Stats Header */}
      <ProfessionalCard>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-neutral-900">Level {currentLevel}</div>
            <div className="text-sm text-neutral-600">Current Level</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">{totalXP}</div>
            <div className="text-sm text-neutral-600 mb-2">Total XP</div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextLevel}%` }}
              />
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              {nextLevelXP - (totalXP % nextLevelXP)} XP to next level
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600 mb-1">{earnedBadges.length}</div>
            <div className="text-sm text-neutral-600">Badges Earned</div>
            <div className="text-xs text-neutral-500">
              {badges.length - earnedBadges.length} remaining
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">#{userRank}</div>
            <div className="text-sm text-neutral-600">Class Rank</div>
            <div className="text-xs text-neutral-500">
              Top {Math.round((userRank / totalUsers) * 100)}%
            </div>
          </div>
        </div>
      </ProfessionalCard>

      {/* Category Filters */}
      <ProfessionalCard>
        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-primary-600 text-white"
            >
              {category.label}
              {category.count > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary-700 text-white">
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </ProfessionalCard>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <ProfessionalCard
            key={badge.id}
            hover={true}
            className={`transition-all duration-200 ${
              badge.earned 
                ? 'border-2 border-primary-200 bg-primary-50/30' 
                : 'opacity-60 hover:opacity-80'
            }`}
          >
            <div className="space-y-4">
              {/* Badge Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl ${
                    badge.earned ? getRarityColor(badge.rarity) : 'bg-neutral-100 text-neutral-400 border-neutral-300'
                  }`}>
                    {badge.earned ? badge.icon : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-sm font-semibold text-neutral-900 ${
                      badge.earned ? '' : 'text-neutral-500'
                    }`}>
                      {badge.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${getCategoryColor(badge.category)}`}>
                        {getCategoryIcon(badge.category)}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        badge.earned ? getRarityColor(badge.rarity) : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-primary-600">+{badge.xpReward} XP</div>
                </div>
              </div>

              {/* Badge Description */}
              <p className={`text-sm ${
                badge.earned ? 'text-neutral-700' : 'text-neutral-500'
              }`}>
                {badge.description}
              </p>

              {/* Progress Bar (for unearned badges) */}
              {!badge.earned && badge.progress !== undefined && badge.maxProgress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-neutral-600">
                    <span>Progress</span>
                    <span>{badge.progress}/{badge.maxProgress}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-1.5">
                    <div
                      className="bg-primary-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Earned Date */}
              {badge.earned && badge.earnedAt && (
                <div className="text-xs text-success-600 font-medium">
                  Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                </div>
              )}

              {/* Lock Status */}
              {!badge.earned && (
                <div className="text-xs text-neutral-500 italic">
                  Complete requirements to unlock this badge
                </div>
              )}
            </div>
          </ProfessionalCard>
        ))}
      </div>

      {/* Achievement Summary */}
      <ProfessionalCard>
        <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-success-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-neutral-900">Achievement Progress</h4>
              <p className="text-sm text-neutral-600">
                You've earned {earnedBadges.length} out of {badges.length} badges ({Math.round((earnedBadges.length / badges.length) * 100)}% complete).
                Keep working to unlock more achievements and climb the leaderboard!
              </p>
            </div>
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
