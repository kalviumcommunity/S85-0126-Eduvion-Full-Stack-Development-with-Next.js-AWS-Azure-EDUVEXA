"use client";

import { useState } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, Crown, Star } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalButton from '@/components/ui/ProfessionalButton';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
  previousRank: number;
  badges: number;
  streak: number;
  weeklyChange: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  timeRange: 'week' | 'month' | 'semester' | 'all-time';
  onTimeRangeChange: (range: string) => void;
  currentUserId: string;
}

export default function Leaderboard({
  users,
  timeRange,
  onTimeRangeChange,
  currentUserId
}: LeaderboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'semester', label: 'This Semester' },
    { id: 'all-time', label: 'All Time' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-neutral-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white border-gray-600';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white border-amber-600';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const getTrendIcon = (currentRank: number, previousRank: number) => {
    if (currentRank < previousRank) {
      return <TrendingUp className="w-4 h-4 text-success-600" />;
    } else if (currentRank > previousRank) {
      return <TrendingUp className="w-4 h-4 text-error-600 rotate-180" />;
    }
    return <div className="w-4 h-4 bg-neutral-300 rounded-full" />;
  };

  const getTrendText = (currentRank: number, previousRank: number) => {
    const change = previousRank - currentRank;
    if (change > 0) return `+${change}`;
    if (change < 0) return `${change}`;
    return '0';
  };

  const currentUser = users.find(user => user.id === currentUserId);
  const topUsers = users.slice(0, 10);
  const otherUsers = users.slice(10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Leaderboard</h3>
            <p className="text-sm text-neutral-600">Top performers this {selectedTimeRange.replace('-', ' ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-600" />
          <span className="text-sm text-neutral-600">{users.length} participants</span>
        </div>
      </div>

      {/* Time Range Selector */}
      <ProfessionalCard>
        <div className="flex items-center gap-2 overflow-x-auto">
          {timeRanges.map((range) => (
            <ProfessionalButton
              key={range.id}
              variant={selectedTimeRange === range.id ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => {
                setSelectedTimeRange(range.id as 'week' | 'month' | 'semester' | 'all-time');
                onTimeRangeChange(range.id);
              }}
            >
              {range.label}
            </ProfessionalButton>
          ))}
        </div>
      </ProfessionalCard>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topUsers.slice(0, 3).map((user) => (
          <ProfessionalCard
            key={user.id}
            hover={true}
            className={`text-center ${
              user.isCurrentUser ? 'border-2 border-primary-500 bg-primary-50/30' : ''
            }`}
          >
            <div className="space-y-4">
              {/* Rank Badge */}
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mx-auto ${getRankBadgeColor(user.rank)}`}>
                {getRankIcon(user.rank)}
              </div>

              {/* User Info */}
              <div className="space-y-2">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-lg font-bold text-neutral-700">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">{user.name}</h4>
                {user.isCurrentUser && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                    You
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex justify-center items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold text-neutral-900">{user.level}</span>
                </div>
                <div className="text-2xl font-bold text-primary-600">{user.xp.toLocaleString()} XP</div>
                <div className="flex justify-center gap-4 text-xs text-neutral-600">
                  <span>{user.badges} badges</span>
                  <span>{user.streak} day streak</span>
                </div>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-center gap-1">
                {getTrendIcon(user.rank, user.previousRank)}
                <span className={`text-xs font-medium ${
                  user.rank < user.previousRank ? 'text-success-600' :
                  user.rank > user.previousRank ? 'text-error-600' : 'text-neutral-600'
                }`}>
                  {getTrendText(user.rank, user.previousRank)}
                </span>
              </div>
            </div>
          </ProfessionalCard>
        ))}
      </div>

      {/* Rest of Leaderboard */}
      <ProfessionalCard>
        <div className="space-y-1">
          {/* Current User Position (if not in top 3) */}
          {currentUser && currentUser.rank > 3 && (
            <div className={`p-4 rounded-lg border-2 border-primary-500 bg-primary-50/30 mb-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">#{currentUser.rank}</span>
                  </div>
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-neutral-700">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-neutral-900">{currentUser.name}</span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                        You
                      </span>
                    </div>
                    <div className="text-xs text-neutral-600">
                      Level {currentUser.level} • {currentUser.badges} badges • {currentUser.streak} day streak
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">{currentUser.xp.toLocaleString()} XP</div>
                  <div className="flex items-center justify-end gap-1">
                    {getTrendIcon(currentUser.rank, currentUser.previousRank)}
                    <span className={`text-xs font-medium ${
                      currentUser.rank < currentUser.previousRank ? 'text-success-600' :
                      currentUser.rank > currentUser.previousRank ? 'text-error-600' : 'text-neutral-600'
                    }`}>
                      {getTrendText(currentUser.rank, currentUser.previousRank)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Users */}
          {otherUsers.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 transition-colors ${
                user.isCurrentUser ? 'border-2 border-primary-500 bg-primary-50/30' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  user.rank <= 3 ? getRankBadgeColor(user.rank) : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {user.rank <= 3 ? getRankIcon(user.rank) : (
                    <span className="text-sm font-bold">#{user.rank}</span>
                  )}
                </div>
                <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-neutral-700">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-900">{user.name}</span>
                    {user.isCurrentUser && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-600">
                    Level {user.level} • {user.badges} badges • {user.streak} day streak
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-primary-600">{user.xp.toLocaleString()} XP</div>
                <div className="flex items-center justify-end gap-1">
                  {getTrendIcon(user.rank, user.previousRank)}
                  <span className={`text-xs font-medium ${
                    user.rank < user.previousRank ? 'text-success-600' :
                    user.rank > user.previousRank ? 'text-error-600' : 'text-neutral-600'
                  }`}>
                    {getTrendText(user.rank, user.previousRank)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ProfessionalCard>

      {/* Leaderboard Insights */}
      <ProfessionalCard>
        <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-primary-900 mb-2">Leaderboard Insights</h4>
              <div className="space-y-1 text-xs text-primary-700">
                <p>• Top performers maintain consistent daily activity and engagement</p>
                <p>• Badge completion significantly impacts ranking and XP gains</p>
                <p>• Weekly streaks provide bonus XP and help maintain position</p>
                {currentUser && (
                  <p>• You're currently in the top {Math.round((currentUser.rank / users.length) * 100)}% of the class</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
