"use client";

import { TrendingUp, Activity, Target } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalProgressBar from '@/components/ui/ProfessionalProgressBar';

interface EngagementScoreWidgetProps {
  score: number;
  weeklyChange: number;
  dailyActiveMinutes: number;
  goalProgress: number;
}

export default function EngagementScoreWidget({
  score,
  weeklyChange,
  dailyActiveMinutes,
  goalProgress
}: EngagementScoreWidgetProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 60) return 'bg-warning-100';
    return 'bg-error-100';
  };

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Main Score */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Engagement Score</h3>
            <div className="flex items-center gap-3">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                weeklyChange >= 0 ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
              }`}>
                <TrendingUp className="w-4 h-4" />
                {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
              </div>
            </div>
          </div>
          <div className={`w-16 h-16 ${getScoreBg(score)} rounded-xl flex items-center justify-center`}>
            <Activity className={`w-8 h-8 ${getScoreColor(score)}`} />
          </div>
        </div>

        {/* Daily Active Minutes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Daily Active Minutes</span>
            <span className="font-semibold text-neutral-900">{dailyActiveMinutes} min</span>
          </div>
          <ProfessionalProgressBar 
            value={(dailyActiveMinutes / 120) * 100} 
            variant="primary"
            size="sm"
          />
        </div>

        {/* Goal Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600">Weekly Goal</span>
            </div>
            <span className="font-semibold text-neutral-900">{goalProgress}%</span>
          </div>
          <ProfessionalProgressBar 
            value={goalProgress} 
            variant="success"
            size="sm"
          />
        </div>
      </div>
    </ProfessionalCard>
  );
}
