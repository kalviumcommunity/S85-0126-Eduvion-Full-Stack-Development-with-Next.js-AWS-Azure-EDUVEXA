"use client";

import { useState } from 'react';
import { Download, Users, TrendingUp, TrendingDown, Target, Award, MessageSquare, BarChart3 } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalButton from '@/components/ui/ProfessionalButton';
import ProfessionalProgressBar from '@/components/ui/ProfessionalProgressBar';

interface TeamMember {
  id: string;
  name: string;
  contribution: number;
  tasksCompleted: number;
  averageRating: number;
  engagementScore: number;
  trend: 'up' | 'down' | 'stable';
}

interface TeamMetrics {
  teamName: string;
  projectId: string;
  timeRange: 'week' | 'month' | 'semester';
  overallPerformance: number;
  completionRate: number;
  averageCollaboration: number;
  totalTasks: number;
  completedTasks: number;
  members: TeamMember[];
  weeklyProgress: Array<{
    week: string;
    completion: number;
    collaboration: number;
  }>;
  strengthAreas: string[];
  improvementAreas: string[];
  feedbackSummary: {
    totalFeedback: number;
    averageRating: number;
    responseRate: number;
  };
}

interface TeamPerformanceReportProps {
  metrics: TeamMetrics;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onTimeRangeChange: (range: string) => void;
}

export default function TeamPerformanceReport({
  metrics,
  onExportPDF,
  onExportCSV,
  onTimeRangeChange
}: TeamPerformanceReportProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(metrics.timeRange);

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'semester', label: 'This Semester' },
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 70) return 'text-primary-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getPerformanceBg = (score: number) => {
    if (score >= 80) return 'bg-success-100';
    if (score >= 70) return 'bg-primary-100';
    if (score >= 60) return 'bg-warning-100';
    return 'bg-error-100';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-error-600" />;
      case 'stable':
        return <div className="w-4 h-4 bg-neutral-300 rounded-full" />;
    }
  };

  const maxCompletion = Math.max(...metrics.weeklyProgress.map(w => w.completion));
  const maxCollaboration = Math.max(...metrics.weeklyProgress.map(w => w.collaboration));

  const contributionBalance = metrics.members.length > 0 ? {
    min: Math.min(...metrics.members.map(m => m.contribution)),
    max: Math.max(...metrics.members.map(m => m.contribution)),
    average: metrics.members.reduce((sum, m) => sum + m.contribution, 0) / metrics.members.length
  } : { min: 0, max: 0, average: 0 };

  const isBalanced = contributionBalance.max - contributionBalance.min <= 20;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Team Performance Report</h2>
          <p className="text-sm text-neutral-600">
            {metrics.teamName} • Project {metrics.projectId} • {selectedTimeRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProfessionalButton
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={onExportCSV}
          >
            Export CSV
          </ProfessionalButton>
          <ProfessionalButton
            variant="primary"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={onExportPDF}
          >
            Export PDF
          </ProfessionalButton>
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
                setSelectedTimeRange(range.id as any);
                onTimeRangeChange(range.id);
              }}
            >
              {range.label}
            </ProfessionalButton>
          ))}
        </div>
      </ProfessionalCard>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className={`w-12 h-12 ${getPerformanceBg(metrics.overallPerformance)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <BarChart3 className={`w-6 h-6 ${getPerformanceColor(metrics.overallPerformance)}`} />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.overallPerformance)}`}>
              {metrics.overallPerformance}%
            </div>
            <div className="text-sm text-neutral-600">Overall Performance</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className={`w-12 h-12 ${getPerformanceBg(metrics.completionRate)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <Target className={`w-6 h-6 ${getPerformanceColor(metrics.completionRate)}`} />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.completionRate)}`}>
              {metrics.completionRate}%
            </div>
            <div className="text-sm text-neutral-600">Completion Rate</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className={`w-12 h-12 ${getPerformanceBg(metrics.averageCollaboration)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <Users className={`w-6 h-6 ${getPerformanceColor(metrics.averageCollaboration)}`} />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.averageCollaboration)}`}>
              {metrics.averageCollaboration}%
            </div>
            <div className="text-sm text-neutral-600">Collaboration Score</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className={`w-12 h-12 ${isBalanced ? 'bg-success-100' : 'bg-warning-100'} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <Award className={`w-6 h-6 ${isBalanced ? 'text-success-600' : 'text-warning-600'}`} />
            </div>
            <div className={`text-2xl font-bold ${isBalanced ? 'text-success-600' : 'text-warning-600'}`}>
              {isBalanced ? 'Balanced' : 'Imbalanced'}
            </div>
            <div className="text-sm text-neutral-600">Workload Distribution</div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Task Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Completed Tasks</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {metrics.completedTasks}/{metrics.totalTasks}
                </span>
              </div>
              <ProfessionalProgressBar 
                value={(metrics.completedTasks / metrics.totalTasks) * 100} 
                variant="success"
              />
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-success-50 rounded-lg">
                  <div className="text-lg font-bold text-success-600">{metrics.completedTasks}</div>
                  <div className="text-xs text-success-600">Completed</div>
                </div>
                <div className="p-3 bg-warning-50 rounded-lg">
                  <div className="text-lg font-bold text-warning-600">
                    {metrics.totalTasks - metrics.completedTasks}
                  </div>
                  <div className="text-xs text-warning-600">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </ProfessionalCard>

        {/* Feedback Summary */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Feedback Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-neutral-50 rounded-lg">
                <div className="text-lg font-bold text-neutral-900">{metrics.feedbackSummary.totalFeedback}</div>
                <div className="text-xs text-neutral-600">Total Feedback</div>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <div className="text-lg font-bold text-primary-600">
                  {metrics.feedbackSummary.averageRating.toFixed(1)}
                </div>
                <div className="text-xs text-neutral-600">Avg Rating</div>
              </div>
              <div className="p-3 bg-success-50 rounded-lg">
                <div className="text-lg font-bold text-success-600">{metrics.feedbackSummary.responseRate}%</div>
                <div className="text-xs text-neutral-600">Response Rate</div>
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Member Performance */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">Member Performance</h3>
          <div className="space-y-3">
            {metrics.members.map((member) => (
              <div key={member.id} className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-neutral-700">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">{member.name}</div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(member.trend)}
                        <span className="text-xs text-neutral-600 capitalize">{member.trend}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">{member.contribution}%</div>
                    <div className="text-xs text-neutral-600">Contribution</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{member.tasksCompleted}</div>
                    <div className="text-xs text-neutral-600">Tasks</div>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${getPerformanceColor(member.averageRating)}`}>
                      {member.averageRating.toFixed(1)}
                    </div>
                    <div className="text-xs text-neutral-600">Rating</div>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${getPerformanceColor(member.engagementScore)}`}>
                      {member.engagementScore}%
                    </div>
                    <div className="text-xs text-neutral-600">Engagement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfessionalCard>

      {/* Weekly Progress Chart */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">Weekly Progress</h3>
          <div className="space-y-4">
            {metrics.weeklyProgress.map((week, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700">{week.week}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-600">{week.completion}% completion</span>
                    <span className="text-sm text-neutral-600">{week.collaboration}% collaboration</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-3 h-3 text-neutral-500" />
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(week.completion / maxCompletion) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-neutral-500" />
                    <div className="flex-1 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-success-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(week.collaboration / maxCollaboration) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfessionalCard>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Strength Areas</h3>
            <div className="space-y-2">
              {metrics.strengthAreas.map((strength, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-success-50 rounded-lg">
                  <Award className="w-4 h-4 text-success-600" />
                  <span className="text-sm text-success-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Improvement Areas</h3>
            <div className="space-y-2">
              {metrics.improvementAreas.map((area, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-warning-50 rounded-lg">
                  <Target className="w-4 h-4 text-warning-600" />
                  <span className="text-sm text-warning-700">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Team Insights */}
      <ProfessionalCard>
        <div className="bg-gradient-to-r from-primary-50 to-success-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-primary-600 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-primary-900 mb-3">Team Performance Insights</h4>
              <div className="space-y-2 text-sm text-primary-700">
                <p>• <strong>Overall Performance:</strong> {metrics.overallPerformance >= 80 ? 'Excellent' : metrics.overallPerformance >= 70 ? 'Good' : 'Needs Improvement'} - Team is performing {metrics.overallPerformance >= 80 ? 'at a high level' : metrics.overallPerformance >= 70 ? 'well' : 'below expectations'}.</p>
                <p>• <strong>Workload Balance:</strong> {isBalanced ? 'Well balanced' : 'Imbalanced'} - {isBalanced ? 'Contributions are evenly distributed across team members.' : 'Consider redistributing tasks for better balance.'}</p>
                <p>• <strong>Collaboration:</strong> {metrics.averageCollaboration >= 80 ? 'Excellent teamwork' : metrics.averageCollaboration >= 60 ? 'Good collaboration' : 'Room for improvement in teamwork'}.</p>
                <p>• <strong>Task Completion:</strong> {metrics.completionRate >= 80 ? 'On track' : metrics.completionRate >= 60 ? 'Slightly behind' : 'Significantly behind schedule'}.</p>
              </div>
            </div>
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
