"use client";

import { useState } from 'react';
import { Download, FileText, Calendar, TrendingUp, Award, Clock, Target, BarChart3 } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalButton from '@/components/ui/ProfessionalButton';

interface StudentMetrics {
  studentName: string;
  studentId: string;
  timeRange: 'week' | 'month' | 'semester' | 'year';
  engagementScore: number;
  completionRate: number;
  averageGrade: number;
  totalXP: number;
  level: number;
  badgesEarned: number;
  streakDays: number;
  weeklyHours: number[];
  skillProgress: Array<{
    skill: string;
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  feedbackSummary: {
    totalFeedback: number;
    averageRating: number;
    topCategories: Array<{
      category: string;
      rating: number;
    }>;
  };
  projectHistory: Array<{
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    grade?: number;
    completionDate?: string;
  }>;
}

interface StudentReportProps {
  metrics: StudentMetrics;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onTimeRangeChange: (range: string) => void;
}

export default function StudentReport({
  metrics,
  onExportPDF,
  onExportCSV,
  onTimeRangeChange
}: StudentReportProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(metrics.timeRange);

  const timeRanges = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'semester', label: 'This Semester' },
    { id: 'year', label: 'This Year' },
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 80) return 'text-primary-600';
    if (score >= 70) return 'text-warning-600';
    return 'text-error-600';
  };

  const getPerformanceBg = (score: number) => {
    if (score >= 90) return 'bg-success-100';
    if (score >= 80) return 'bg-primary-100';
    if (score >= 70) return 'bg-warning-100';
    return 'bg-error-100';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-success-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-error-600 rotate-180" />;
      case 'stable':
        return <div className="w-4 h-4 bg-neutral-300 rounded-full" />;
    }
  };

  const averageWeeklyHours = metrics.weeklyHours.reduce((a, b) => a + b, 0) / metrics.weeklyHours.length;
  const maxWeeklyHours = Math.max(...metrics.weeklyHours);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Student Performance Report</h2>
          <p className="text-sm text-neutral-600">
            {metrics.studentName} • {metrics.studentId} • {selectedTimeRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ProfessionalButton
            variant="secondary"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
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
          <Calendar className="w-4 h-4 text-neutral-600 flex-shrink-0" />
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

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className={`w-12 h-12 ${getPerformanceBg(metrics.engagementScore)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <BarChart3 className={`w-6 h-6 ${getPerformanceColor(metrics.engagementScore)}`} />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.engagementScore)}`}>
              {metrics.engagementScore}%
            </div>
            <div className="text-sm text-neutral-600">Engagement Score</div>
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
            <div className={`w-12 h-12 ${getPerformanceBg(metrics.averageGrade)} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              <Award className={`w-6 h-6 ${getPerformanceColor(metrics.averageGrade)}`} />
            </div>
            <div className={`text-2xl font-bold ${getPerformanceColor(metrics.averageGrade)}`}>
              {metrics.averageGrade}%
            </div>
            <div className="text-sm text-neutral-600">Average Grade</div>
          </div>
        </ProfessionalCard>

        <ProfessionalCard hover={true}>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-primary-600">{Math.round(averageWeeklyHours)}h</div>
            <div className="text-sm text-neutral-600">Weekly Average</div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Progress and Achievement Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Progress */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Skill Development</h3>
            <div className="space-y-3">
              {metrics.skillProgress.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-900">{skill.skill}</span>
                      {getTrendIcon(skill.trend)}
                    </div>
                    <span className="text-sm text-neutral-600">
                      {skill.current}/{skill.target}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(skill.current / skill.target) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ProfessionalCard>

        {/* Gamification Stats */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary-50 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{metrics.level}</div>
                <div className="text-sm text-neutral-600">Current Level</div>
              </div>
              <div className="text-center p-4 bg-warning-50 rounded-lg">
                <div className="text-2xl font-bold text-warning-600">{metrics.totalXP.toLocaleString()}</div>
                <div className="text-sm text-neutral-600">Total XP</div>
              </div>
              <div className="text-center p-4 bg-success-50 rounded-lg">
                <div className="text-2xl font-bold text-success-600">{metrics.badgesEarned}</div>
                <div className="text-sm text-neutral-600">Badges Earned</div>
              </div>
              <div className="text-center p-4 bg-error-50 rounded-lg">
                <div className="text-2xl font-bold text-error-600">{metrics.streakDays}</div>
                <div className="text-sm text-neutral-600">Day Streak</div>
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Weekly Activity Chart */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">Weekly Activity</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700">{day}</span>
                  <span className="text-sm text-neutral-600">{metrics.weeklyHours[index]}h</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(metrics.weeklyHours[index] / maxWeeklyHours) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfessionalCard>

      {/* Feedback Summary */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">Feedback Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-neutral-50 rounded-lg">
              <div className="text-2xl font-bold text-neutral-900">{metrics.feedbackSummary.totalFeedback}</div>
              <div className="text-sm text-neutral-600">Total Feedback</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{metrics.feedbackSummary.averageRating.toFixed(1)}</div>
              <div className="text-sm text-neutral-600">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-success-50 rounded-lg">
              <div className="text-2xl font-bold text-success-600">
                {metrics.feedbackSummary.topCategories.length}
              </div>
              <div className="text-sm text-neutral-600">Top Categories</div>
            </div>
          </div>
          
          {metrics.feedbackSummary.topCategories.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-neutral-900">Top Performing Areas</h4>
              {metrics.feedbackSummary.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                  <span className="text-sm text-neutral-700">{category.category}</span>
                  <span className="text-sm font-semibold text-neutral-900">{category.rating.toFixed(1)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </ProfessionalCard>

      {/* Project History */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">Project History</h3>
          <div className="space-y-2">
            {metrics.projectHistory.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    project.status === 'completed' ? 'bg-success-500' :
                    project.status === 'in-progress' ? 'bg-warning-500' : 'bg-neutral-400'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-neutral-900">{project.name}</div>
                    <div className="text-xs text-neutral-600">
                      {project.status === 'completed' && project.completionDate ?
                        `Completed ${project.completionDate}` :
                        project.status === 'in-progress' ? 'In Progress' : 'Pending'
                      }
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {project.grade && (
                    <div className={`text-sm font-semibold ${getPerformanceColor(project.grade)}`}>
                      {project.grade}%
                    </div>
                  )}
                  <div className="text-xs text-neutral-600 capitalize">{project.status.replace('-', ' ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
