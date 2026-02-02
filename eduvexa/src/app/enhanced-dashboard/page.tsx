"use client";

import { useState } from 'react';
import UnifiedLayout from '@/components/layout/UnifiedLayout';
import UnifiedSidebar from '@/components/layout/UnifiedSidebar';
import EngagementScoreWidget from '@/components/dashboard/EngagementScoreWidget';
import TasksOverviewWidget from '@/components/dashboard/TasksOverviewWidget';
import TeamContributionWidget from '@/components/dashboard/TeamContributionWidget';
import WeeklyActivityWidget from '@/components/dashboard/WeeklyActivityWidget';
import PersonalProgressTimeline from '@/components/student/PersonalProgressTimeline';
import SkillGrowthTracking from '@/components/student/SkillGrowthTracking';
import WorkloadIndicator from '@/components/student/WorkloadIndicator';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import { Calendar, TrendingUp, Users, Target, Award, MessageSquare } from 'lucide-react';

export default function EnhancedDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'progress' | 'team' | 'analytics'>('overview');

  // Sample data for demonstration
  const engagementData = {
    score: 85,
    weeklyChange: 12,
    dailyActiveMinutes: 95,
    goalProgress: 78
  };

  const tasksData = {
    total: 24,
    completed: 18,
    inProgress: 6,
    pending: 0,
    weeklyTrend: 15
  };

  const teamData = {
    teamMembers: [
      { id: '1', name: 'John Doe', avatar: '', contribution: 35, tasksCompleted: 8, trend: 1 },
      { id: '2', name: 'Jane Smith', avatar: '', contribution: 28, tasksCompleted: 6, trend: 0 },
      { id: '3', name: 'Mike Johnson', avatar: '', contribution: 22, tasksCompleted: 4, trend: -1 },
      { id: '4', name: 'Sarah Wilson', avatar: '', contribution: 15, tasksCompleted: 3, trend: 1 }
    ],
    totalContributions: 100
  };

  const weeklyActivityData = [
    { day: 'Monday', hours: 8, tasks: 3, engagement: 92 },
    { day: 'Tuesday', hours: 6, tasks: 2, engagement: 85 },
    { day: 'Wednesday', hours: 10, tasks: 4, engagement: 95 },
    { day: 'Thursday', hours: 7, tasks: 3, engagement: 88 },
    { day: 'Friday', hours: 9, tasks: 3, engagement: 90 },
    { day: 'Saturday', hours: 4, tasks: 1, engagement: 75 },
    { day: 'Sunday', hours: 3, tasks: 1, engagement: 70 }
  ];

  const timelineEvents = [
    {
      id: '1',
      date: '2024-01-30',
      type: 'milestone' as const,
      title: 'Completed Advanced React Module',
      description: 'Successfully finished the React hooks and state management module',
      progress: 100
    },
    {
      id: '2',
      date: '2024-01-28',
      type: 'achievement' as const,
      title: 'Earned Collaboration Badge',
      description: 'Received recognition for excellent teamwork on the group project',
      progress: 100
    },
    {
      id: '3',
      date: '2024-01-25',
      type: 'task' as const,
      title: 'Submitted Database Assignment',
      description: 'Completed and submitted the SQL optimization assignment',
      progress: 100
    }
  ];

  const skillsData = [
    { id: '1', name: 'React Development', category: 'technical', currentLevel: 4, maxLevel: 5, progress: 80, trend: 'up' as const, hoursPracticed: 45 },
    { id: '2', name: 'Team Collaboration', category: 'collaboration', currentLevel: 3, maxLevel: 5, progress: 60, trend: 'up' as const, hoursPracticed: 30 },
    { id: '3', name: 'Communication', category: 'communication', currentLevel: 4, maxLevel: 5, progress: 85, trend: 'stable' as const, hoursPracticed: 25 }
  ];

  const workloadData = {
    tasks: [
      { id: '1', title: 'Complete Project Documentation', priority: 'high' as const, estimatedHours: 4, dueDate: '2024-02-02', status: 'in_progress' as const },
      { id: '2', title: 'Review Team Pull Requests', priority: 'medium' as const, estimatedHours: 2, dueDate: '2024-02-01', status: 'pending' as const },
      { id: '3', title: 'Prepare Presentation', priority: 'high' as const, estimatedHours: 3, dueDate: '2024-02-03', status: 'pending' as const }
    ],
    weeklyCapacity: 40,
    currentWorkload: 32
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-600 mt-1">Welcome back! Here's your learning progress.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <Calendar className="w-4 h-4" />
          <span>Last updated: 2 minutes ago</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <EngagementScoreWidget {...engagementData} />
        <TasksOverviewWidget {...tasksData} />
        <TeamContributionWidget {...teamData} />
        <WeeklyActivityWidget weekData={weeklyActivityData} streak={5} totalHours={47} />
      </div>

      {/* Quick Actions */}
      <ProfessionalCard>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
            <Target className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-semibold text-primary-900">Set New Goals</h3>
            <p className="text-sm text-primary-700">Define your learning objectives</p>
          </button>
          <button className="p-4 bg-success-50 rounded-xl hover:bg-success-100 transition-colors">
            <MessageSquare className="w-6 h-6 text-success-600 mb-2" />
            <h3 className="font-semibold text-success-900">Give Feedback</h3>
            <p className="text-sm text-success-700">Help your peers improve</p>
          </button>
          <button className="p-4 bg-warning-50 rounded-xl hover:bg-warning-100 transition-colors">
            <Award className="w-6 h-6 text-warning-600 mb-2" />
            <h3 className="font-semibold text-warning-900">View Badges</h3>
            <p className="text-sm text-warning-700">Check your achievements</p>
          </button>
        </div>
      </ProfessionalCard>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Personal Progress</h1>
        <p className="text-neutral-600 mt-1">Track your learning journey and skill development.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PersonalProgressTimeline 
          events={timelineEvents}
          currentLevel={12}
          totalXP={2850}
        />
        <SkillGrowthTracking 
          skills={skillsData}
          overallGrowth={15}
        />
      </div>

      <WorkloadIndicator {...workloadData} />
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Team Collaboration</h1>
        <p className="text-neutral-600 mt-1">Monitor team performance and contributions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamContributionWidget {...teamData} />
        <ProfessionalCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Team Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-success-50 rounded-lg">
                <p className="text-sm text-success-700">Team collaboration score increased by 12% this week</p>
              </div>
              <div className="p-3 bg-warning-50 rounded-lg">
                <p className="text-sm text-warning-700">Consider redistributing workload for better balance</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">Team is on track to meet project deadline</p>
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Analytics & Reports</h1>
        <p className="text-neutral-600 mt-1">Detailed insights into your learning patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyActivityWidget weekData={weeklyActivityData} streak={5} totalHours={47} />
        <ProfessionalCard>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-neutral-900">Performance Trends</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Engagement Trend</span>
                <span className="text-sm font-semibold text-success-600">+15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Task Completion</span>
                <span className="text-sm font-semibold text-primary-600">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Skill Growth</span>
                <span className="text-sm font-semibold text-warning-600">+3 skills</span>
              </div>
            </div>
          </div>
        </ProfessionalCard>
      </div>
    </div>
  );

  return (
    <UnifiedLayout sidebar={<UnifiedSidebar />}>
      {/* View Selector */}
      <div className="mb-6">
        <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'progress', label: 'Progress', icon: <Target className="w-4 h-4" /> },
            { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <Award className="w-4 h-4" /> }
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeView === view.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
                }
              `}
            >
              {view.icon}
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render Active View */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'progress' && renderProgress()}
      {activeView === 'team' && renderTeam()}
      {activeView === 'analytics' && renderAnalytics()}
    </UnifiedLayout>
  );
}
