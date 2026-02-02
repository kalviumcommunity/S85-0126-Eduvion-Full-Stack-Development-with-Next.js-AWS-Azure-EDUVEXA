"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Users, 
  CheckSquare,
  Plus,
  User,
  Activity,
  Star,
  Target
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface DashboardData {
  stats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    ownedProjects: number;
    feedbackGiven: number;
    feedbackReceived: number;
    averageRating: number;
    engagementScore: number;
  };
  recentActivity: Array<{
    id: number;
    action: string;
    createdAt: string;
    metadata?: any;
  }>;
  recentTasks: Array<{
    id: number;
    title: string;
    status: string;
    project: {
      title: string;
    };
  }>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getEngagementBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name || 'User'}! Here's your learning overview.
          </p>
        </div>
        <Button 
          label="View Profile" 
          onClick={() => router.push('/profile')}
          variant="secondary"
          icon={<User className="w-4 h-4" />}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData?.stats.totalTasks || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData?.stats.completedTasks || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData?.stats.inProgressTasks || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
              <p className={`text-2xl font-bold mt-1 ${getEngagementColor(dashboardData?.stats.engagementScore || 0)}`}>
                {dashboardData?.stats.engagementScore || 0}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getEngagementBg(dashboardData?.stats.engagementScore || 0)}`}>
              <TrendingUp className={`w-6 h-6 ${getEngagementColor(dashboardData?.stats.engagementScore || 0)}`} />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData?.stats.ownedProjects || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Feedback Given</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {dashboardData?.stats.feedbackGiven || 0}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card variant="elevated" hover={true}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.stats.averageRating?.toFixed(1) || '0.0'}
                </p>
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Recent Activity" variant="elevated">
          <div className="space-y-4">
            {dashboardData?.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {activity.action.replace('_', ' ')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </Card>

        <Card title="Recent Tasks" variant="elevated">
          <div className="space-y-4">
            {dashboardData?.recentTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className={`w-3 h-3 rounded-full ${
                  task.status === 'COMPLETED' ? 'bg-green-500' :
                  task.status === 'IN_PROGRESS' ? 'bg-yellow-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {task.project.title} • {task.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No tasks assigned yet
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" variant="elevated">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            label="Create New Task" 
            variant="primary" 
            fullWidth
            icon={<Plus className="w-4 h-4" />}
            onClick={() => router.push('/projects')}
          />
          <Button 
            label="View Progress" 
            variant="secondary" 
            fullWidth
            icon={<TrendingUp className="w-4 h-4" />}
            onClick={() => router.push('/student-progress')}
          />
          <Button 
            label="Team Collaboration" 
            variant="secondary" 
            fullWidth
            icon={<Users className="w-4 h-4" />}
            onClick={() => router.push('/peer-feedback')}
          />
        </div>
      </Card>
    </div>
  );
}
