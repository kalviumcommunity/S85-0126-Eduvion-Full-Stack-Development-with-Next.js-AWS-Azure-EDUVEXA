"use client";

import { Users, PieChart } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  contribution: number;
  tasksCompleted: number;
  trend: number;
}

interface TeamContributionWidgetProps {
  teamMembers: TeamMember[];
}

export default function TeamContributionWidget({
  teamMembers
}: TeamContributionWidgetProps) {
  const getContributionColor = (contribution: number) => {
    if (contribution >= 30) return 'bg-success-500';
    if (contribution >= 20) return 'bg-primary-500';
    if (contribution >= 10) return 'bg-warning-500';
    return 'bg-neutral-400';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Team Contribution</h3>
              <p className="text-sm text-neutral-600">Last 7 days</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-neutral-900">{teamMembers.length}</div>
            <div className="text-xs text-neutral-600">members</div>
          </div>
        </div>

        {/* Contribution Bars */}
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-neutral-700">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                    <div className="text-xs text-neutral-600">
                      {member.tasksCompleted} tasks
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-neutral-900">
                    {member.contribution}%
                  </span>
                  <span className="text-xs">{getTrendIcon(member.trend)}</span>
                </div>
              </div>
              
              {/* Contribution Bar */}
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className={`${getContributionColor(member.contribution)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${member.contribution}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Team Insights */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <PieChart className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-primary-900 mb-1">Team Balance</h4>
              <p className="text-xs text-primary-700">
                {teamMembers.length > 0 ? (
                  teamMembers.some(m => m.contribution >= 30) && 
                  teamMembers.some(m => m.contribution < 10) ?
                    "Consider redistributing workload for better team balance." :
                    "Good team distribution! Contributions are well balanced."
                ) : "No team members to analyze."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
