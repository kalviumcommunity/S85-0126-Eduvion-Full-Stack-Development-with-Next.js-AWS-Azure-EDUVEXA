"use client";

import { CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import ProfessionalProgressBar from '@/components/ui/ProfessionalProgressBar';

interface TasksOverviewWidgetProps {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  weeklyTrend: number;
}

export default function TasksOverviewWidget({
  total,
  completed,
  inProgress,
  pending,
  weeklyTrend
}: TasksOverviewWidgetProps) {
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  const taskStats = [
    {
      label: 'Completed',
      value: completed,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      label: 'Pending',
      value: pending,
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-error-600',
      bgColor: 'bg-error-100',
    },
  ];

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Tasks Overview</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-neutral-900">{total}</span>
              <span className="text-sm text-neutral-600">total tasks</span>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium ${
                weeklyTrend >= 0 ? 'bg-success-100 text-success-700' : 'bg-error-100 text-error-700'
              }`}>
                <TrendingUp className="w-4 h-4" />
                {weeklyTrend >= 0 ? '+' : ''}{weeklyTrend}%
              </div>
            </div>
          </div>
        </div>

        {/* Task Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {taskStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-lg font-semibold text-neutral-900">{stat.value}</div>
              <div className="text-xs text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Completion Rate</span>
            <span className="font-semibold text-neutral-900">{Math.round(completionRate)}%</span>
          </div>
          <ProfessionalProgressBar 
            value={completionRate} 
            variant="primary"
            size="sm"
          />
        </div>

        {/* Quick Insights */}
        <div className="bg-neutral-50 rounded-lg p-3">
          <div className="text-sm text-neutral-700">
            {completionRate >= 80 ? 
              "🎉 Excellent progress! You're on track to complete all tasks." :
              completionRate >= 60 ?
              "📈 Good progress! Keep maintaining your current pace." :
              "⚠️ Consider prioritizing pending tasks to improve completion rate."
            }
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
