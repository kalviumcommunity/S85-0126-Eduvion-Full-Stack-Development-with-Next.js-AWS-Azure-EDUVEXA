"use client";

import { AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';
import ProfessionalCard from '@/components/ui/ProfessionalCard';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface WorkloadIndicatorProps {
  tasks: Task[];
  weeklyCapacity: number;
  currentWorkload: number;
}

export default function WorkloadIndicator({
  tasks,
  weeklyCapacity,
  currentWorkload
}: WorkloadIndicatorProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-error-100 text-error-700 border-error-200';
      case 'medium':
        return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'low':
        return 'bg-success-100 text-success-700 border-success-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getWorkloadStatus = () => {
    const percentage = (currentWorkload / weeklyCapacity) * 100;
    if (percentage >= 90) return { status: 'overloaded', color: 'error', icon: AlertTriangle };
    if (percentage >= 70) return { status: 'heavy', color: 'warning', icon: Clock };
    if (percentage >= 40) return { status: 'moderate', color: 'primary', icon: Target };
    return { status: 'light', color: 'success', icon: CheckCircle };
  };

  const workloadStatus = getWorkloadStatus();
  const workloadPercentage = (currentWorkload / weeklyCapacity) * 100;
  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');

  return (
    <ProfessionalCard hover={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Workload Indicator</h3>
            <p className="text-sm text-neutral-600">Manage your tasks effectively</p>
          </div>
          <div className={`w-10 h-10 bg-${workloadStatus.color}-100 rounded-lg flex items-center justify-center`}>
            <workloadStatus.icon className={`w-5 h-5 text-${workloadStatus.color}-600`} />
          </div>
        </div>

        {/* Workload Status */}
        <div className={`bg-${workloadStatus.color}-50 rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`text-sm font-semibold text-${workloadStatus.color}-900 capitalize`}>
              {workloadStatus.status} Workload
            </h4>
            <span className={`text-lg font-bold text-${workloadStatus.color}-600`}>
              {Math.round(workloadPercentage)}%
            </span>
          </div>
          <p className={`text-xs text-${workloadStatus.color}-700`}>
            {currentWorkload}h of {weeklyCapacity}h weekly capacity
          </p>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-neutral-50 rounded-lg">
            <div className="text-lg font-bold text-neutral-900">{pendingTasks.length}</div>
            <div className="text-xs text-neutral-600">Pending Tasks</div>
          </div>
          <div className="text-center p-3 bg-error-50 rounded-lg">
            <div className="text-lg font-bold text-error-600">{highPriorityTasks.length}</div>
            <div className="text-xs text-error-600">High Priority</div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-900">Upcoming Tasks</h4>
          <div className="space-y-2">
            {pendingTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    task.priority === 'high' ? 'bg-error-500' :
                    task.priority === 'medium' ? 'bg-warning-500' : 'bg-success-500'
                  }`} />
                  <span className="text-sm font-medium text-neutral-900 truncate max-w-[150px]">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-neutral-500">{task.estimatedHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-primary-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-primary-900 mb-1">Recommendations</h4>
              <p className="text-xs text-primary-700">
                {workloadStatus.status === 'overloaded' ?
                  "Consider delegating or extending deadlines for some tasks." :
                  workloadStatus.status === 'heavy' ?
                  "Focus on high-priority tasks first to manage workload effectively." :
                  workloadStatus.status === 'moderate' ?
                  "Good balance! Maintain steady progress on current tasks." :
                  "You have capacity to take on additional challenges if desired."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalCard>
  );
}
