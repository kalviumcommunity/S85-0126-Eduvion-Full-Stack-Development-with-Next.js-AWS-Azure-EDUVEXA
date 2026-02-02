"use client";

import { Calendar, Activity, Flame } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';

interface DayActivity {
  day: string;
  hours: number;
  tasks: number;
  engagement: number;
}

interface WeeklyActivityWidgetProps {
  weekData: DayActivity[];
  streak: number;
  totalHours: number;
}

export default function WeeklyActivityWidget({
  weekData,
  streak,
  totalHours
}: WeeklyActivityWidgetProps) {
  const maxHours = Math.max(...weekData.map(d => d.hours));
  
  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'bg-success-400';
    if (engagement >= 60) return 'bg-warning-400';
    return 'bg-neutral-300';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '📅';
  };

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Weekly Activity</h3>
              <p className="text-sm text-neutral-600">Last 7 days</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getStreakEmoji(streak)}</span>
              <div>
                <div className="text-lg font-bold text-neutral-900">{streak}</div>
                <div className="text-xs text-neutral-600">day streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Daily Hours</span>
            <span className="font-semibold text-neutral-900">{totalHours}h total</span>
          </div>
          
          <div className="space-y-3">
            {weekData.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700 w-12">
                    {day.day.slice(0, 3)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-neutral-600">{day.hours}h</span>
                    <span className="text-xs text-neutral-500">{day.tasks} tasks</span>
                  </div>
                </div>
                
                {/* Hours Bar */}
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(day.hours / maxHours) * 100}%` }}
                  />
                </div>
                
                {/* Engagement Indicator */}
                <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-neutral-400" />
                  <div className="flex-1 bg-neutral-200 rounded-full h-1">
                    <div
                      className={`${getEngagementColor(day.engagement)} h-1 rounded-full transition-all duration-500`}
                      style={{ width: `${day.engagement}%` }}
                    />
                  </div>
                  <span className="text-xs text-neutral-500">{day.engagement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="bg-warning-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Flame className="w-5 h-5 text-warning-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-warning-900 mb-1">Activity Pattern</h4>
              <p className="text-xs text-warning-700">
                {totalHours >= 20 ? 
                  "Excellent consistency! You're maintaining great engagement." :
                  totalHours >= 10 ?
                  "Good activity level. Try to maintain daily consistency." :
                  "Consider increasing daily activity to improve learning outcomes."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
