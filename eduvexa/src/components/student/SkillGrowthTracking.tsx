"use client";

import { TrendingUp, Brain, Target, Zap } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalProgressBar from '@/components/ui/ProfessionalProgressBar';

interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  maxLevel: number;
  progress: number;
  trend: 'up' | 'down' | 'stable';
  hoursPracticed: number;
}

interface SkillGrowthTrackingProps {
  skills: Skill[];
  overallGrowth: number;
}

export default function SkillGrowthTracking({
  skills,
  overallGrowth
}: SkillGrowthTrackingProps) {
  const getSkillIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical':
        return <Brain className="w-4 h-4" />;
      case 'communication':
        return <Zap className="w-4 h-4" />;
      case 'collaboration':
        return <Target className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      case 'stable':
        return 'text-neutral-600';
      default:
        return 'text-neutral-600';
    }
  };

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Skill Growth</h3>
            <p className="text-sm text-neutral-600">Track your development</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 text-lg font-semibold ${
              overallGrowth >= 0 ? 'text-success-600' : 'text-error-600'
            }`}>
              <TrendingUp className="w-5 h-5" />
              {overallGrowth >= 0 ? '+' : ''}{overallGrowth}%
            </div>
            <div className="text-xs text-neutral-600">overall growth</div>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <div className="text-primary-600">
                      {getSkillIcon(skill.category)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{skill.name}</div>
                    <div className="text-xs text-neutral-600">
                      Level {skill.currentLevel}/{skill.maxLevel} • {skill.hoursPracticed}h
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getTrendColor(skill.trend)}`}>
                    {getTrendIcon(skill.trend)}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {skill.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <ProfessionalProgressBar 
                value={skill.progress} 
                variant="primary"
                size="sm"
              />
            </div>
          ))}
        </div>

        {/* Skill Insights */}
        <div className="bg-success-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-success-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-success-900 mb-1">Learning Focus</h4>
              <p className="text-xs text-success-700">
                {skills.length > 0 ? (
                  skills.some(s => s.trend === 'up') ?
                    "Great progress! Your skills are improving consistently." :
                    "Consider dedicating more time to practice areas showing decline."
                ) : "Start tracking your skills to monitor growth."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
