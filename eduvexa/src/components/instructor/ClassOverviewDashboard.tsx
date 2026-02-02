"use client";

import { Users, TrendingUp, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalProgressBar from '@/components/ui/ProfessionalProgressBar';

interface StudentMetrics {
  totalStudents: number;
  activeStudents: number;
  atRiskStudents: number;
  averageEngagement: number;
  completionRate: number;
}

interface TeamMetrics {
  totalTeams: number;
  balancedTeams: number;
  imbalancedTeams: number;
  averageTeamSize: number;
}

interface ProjectMetrics {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  averageProjectScore: number;
}

interface ClassOverviewDashboardProps {
  className: string;
  studentMetrics: StudentMetrics;
  teamMetrics: TeamMetrics;
  projectMetrics: ProjectMetrics;
  weeklyActivity: Array<{
    day: string;
    engagement: number;
    submissions: number;
  }>;
}

export default function ClassOverviewDashboard({
  className,
  studentMetrics,
  teamMetrics,
  projectMetrics,
  weeklyActivity
}: ClassOverviewDashboardProps) {
  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-success-600';
    if (engagement >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getEngagementBg = (engagement: number) => {
    if (engagement >= 80) return 'bg-success-100';
    if (engagement >= 60) return 'bg-warning-100';
    return 'bg-error-100';
  };

  const maxEngagement = Math.max(...weeklyActivity.map(d => d.engagement));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">{className}</h2>
          <p className="text-sm text-neutral-600">Class performance overview</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-600">Last updated:</span>
          <span className="text-sm font-medium text-neutral-900">2 minutes ago</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Students Overview */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Students</h3>
                <p className="text-xs text-neutral-600">Total enrolled</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-neutral-50 rounded">
                <div className="text-lg font-bold text-neutral-900">{studentMetrics.totalStudents}</div>
                <div className="text-xs text-neutral-600">Total</div>
              </div>
              <div className="text-center p-2 bg-success-50 rounded">
                <div className="text-lg font-bold text-success-600">{studentMetrics.activeStudents}</div>
                <div className="text-xs text-success-600">Active</div>
              </div>
            </div>
          </div>
        </ProfessionalCard>

        {/* At-Risk Alert */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${
                studentMetrics.atRiskStudents > 0 ? 'bg-error-100' : 'bg-success-100'
              } rounded-lg flex items-center justify-center`}>
                <AlertTriangle className={`w-5 h-5 ${
                  studentMetrics.atRiskStudents > 0 ? 'text-error-600' : 'text-success-600'
                }`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">At-Risk Students</h3>
                <p className="text-xs text-neutral-600">Need attention</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                studentMetrics.atRiskStudents > 0 ? 'text-error-600' : 'text-success-600'
              }`}>
                {studentMetrics.atRiskStudents}
              </div>
              <div className="text-xs text-neutral-600">
                {studentMetrics.atRiskStudents === 0 ? 'All on track' : 'Require intervention'}
              </div>
            </div>
          </div>
        </ProfessionalCard>

        {/* Average Engagement */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${getEngagementBg(studentMetrics.averageEngagement)} rounded-lg flex items-center justify-center`}>
                <TrendingUp className={`w-5 h-5 ${getEngagementColor(studentMetrics.averageEngagement)}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Avg Engagement</h3>
                <p className="text-xs text-neutral-600">Class average</p>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getEngagementColor(studentMetrics.averageEngagement)}`}>
                {studentMetrics.averageEngagement}%
              </div>
              <ProfessionalProgressBar 
                value={studentMetrics.averageEngagement} 
                variant="primary"
                size="sm"
              />
            </div>
          </div>
        </ProfessionalCard>

        {/* Completion Rate */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">Completion Rate</h3>
                <p className="text-xs text-neutral-600">On-time submissions</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">{studentMetrics.completionRate}%</div>
              <ProfessionalProgressBar 
                value={studentMetrics.completionRate} 
                variant="success"
                size="sm"
              />
            </div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Teams and Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Overview */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Team Overview</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-neutral-900">{teamMetrics.totalTeams}</div>
                <div className="text-xs text-neutral-600">Total Teams</div>
              </div>
              <div>
                <div className="text-lg font-bold text-success-600">{teamMetrics.balancedTeams}</div>
                <div className="text-xs text-neutral-600">Balanced</div>
              </div>
              <div>
                <div className="text-lg font-bold text-warning-600">{teamMetrics.imbalancedTeams}</div>
                <div className="text-xs text-neutral-600">Need Help</div>
              </div>
            </div>

            {teamMetrics.imbalancedTeams > 0 && (
              <div className="bg-warning-50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning-600" />
                  <span className="text-sm font-medium text-warning-900">
                    {teamMetrics.imbalancedTeams} teams need attention
                  </span>
                </div>
                <p className="text-xs text-warning-700 mt-1">
                  Consider redistributing workload or providing additional support
                </p>
              </div>
            )}
          </div>
        </ProfessionalCard>

        {/* Project Progress */}
        <ProfessionalCard hover={true}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-neutral-600" />
              <h3 className="text-lg font-semibold text-neutral-900">Project Progress</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Total Projects</span>
                <span className="text-sm font-semibold text-neutral-900">{projectMetrics.totalProjects}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Completed</span>
                  <span className="text-sm font-semibold text-success-600">{projectMetrics.completedProjects}</span>
                </div>
                <ProfessionalProgressBar 
                  value={(projectMetrics.completedProjects / projectMetrics.totalProjects) * 100} 
                  variant="success"
                  size="sm"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">In Progress</span>
                  <span className="text-sm font-semibold text-warning-600">{projectMetrics.inProgressProjects}</span>
                </div>
                <ProfessionalProgressBar 
                  value={(projectMetrics.inProgressProjects / projectMetrics.totalProjects) * 100} 
                  variant="warning"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </div>

      {/* Weekly Activity */}
      <ProfessionalCard hover={true}>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-neutral-600" />
            <h3 className="text-lg font-semibold text-neutral-900">Weekly Activity</h3>
          </div>
          
          <div className="space-y-3">
            {weeklyActivity.map((day, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-700">{day.day}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-neutral-600">{day.submissions} submissions</span>
                    <span className="text-sm font-semibold text-neutral-900">{day.engagement}% engagement</span>
                  </div>
                </div>
                <ProfessionalProgressBar 
                  value={(day.engagement / maxEngagement) * 100} 
                  variant="primary"
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </ProfessionalCard>
    </div>
  );
}
