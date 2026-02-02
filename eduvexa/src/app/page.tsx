"use client";

import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  Play, 
  FileText, 
  MessageSquare, 
  Target, 
  Award,
  Zap,
  Activity
} from "lucide-react";
import { Button } from "@/components";

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div />

      <div className="max-w-6xl">
        {/* Stunning Welcome Banner */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  {isLoggedIn && user ? `Welcome back, ${user.name?.split(' ')[0]}! 👋` : "Welcome to EDUVEXA! �"}
                </h1>
                <p className="text-white/90 text-base mb-6 max-w-2xl">
                  Track your learning progress, collaborate with peers, and achieve your educational goals
                </p>
                <div className="flex gap-4">
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="secondary"
                    className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                  >
                    View Dashboard
                  </Button>
                  <Button 
                    variant="ghost"
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm transform rotate-12">
                  <BarChart3 className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div 
            className="group relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-3xl p-7 shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-500 hover:shadow-blue-500/40 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-white/25 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl shadow-white/10 transform group-hover:rotate-12 transition-transform duration-500">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-white/25 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-bold">+12%</span>
              </div>
            </div>
            <div className="relative">
              <h3 className="text-white/90 text-sm font-semibold mb-2 tracking-wide">Total Tasks</h3>
              <p className="text-4xl font-bold text-white mb-1">124</p>
              <p className="text-white/70 text-xs">Active assignments</p>
            </div>
          </div>

          <div 
            className="group relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 rounded-3xl p-7 shadow-2xl shadow-emerald-500/30 transform hover:scale-105 transition-all duration-500 hover:shadow-emerald-500/40 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-white/25 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl shadow-white/10 transform group-hover:rotate-12 transition-transform duration-500">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-white/25 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-bold">+8%</span>
              </div>
            </div>
            <div className="relative">
              <h3 className="text-white/90 text-sm font-semibold mb-2 tracking-wide">Completed</h3>
              <p className="text-4xl font-bold text-white mb-1">89</p>
              <p className="text-white/70 text-xs">Tasks finished</p>
            </div>
          </div>

          <div 
            className="group relative bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-500 rounded-3xl p-7 shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition-all duration-500 hover:shadow-amber-500/40 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-white/25 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl shadow-white/10 transform group-hover:rotate-12 transition-transform duration-500">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-white/25 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-bold">+5%</span>
              </div>
            </div>
            <div className="relative">
              <h3 className="text-white/90 text-sm font-semibold mb-2 tracking-wide">In Progress</h3>
              <p className="text-4xl font-bold text-white mb-1">28</p>
              <p className="text-white/70 text-xs">Active now</p>
            </div>
          </div>

          <div 
            className="group relative bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 rounded-3xl p-7 shadow-2xl shadow-purple-500/30 transform hover:scale-105 transition-all duration-500 hover:shadow-purple-500/40 overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center justify-between mb-6">
              <div className="w-16 h-16 bg-white/25 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl shadow-white/10 transform group-hover:rotate-12 transition-transform duration-500">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex items-center gap-2 bg-white/25 backdrop-blur-xl px-3 py-2 rounded-xl shadow-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-bold">+2</span>
              </div>
            </div>
            <div className="relative">
              <h3 className="text-white/90 text-sm font-semibold mb-2 tracking-wide">Team Members</h3>
              <p className="text-4xl font-bold text-white mb-1">12</p>
              <p className="text-white/70 text-xs">Active learners</p>
            </div>
          </div>
        </div>

      {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Recent Activity</h2>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              {[
                { user: "John Doe", action: "completed", task: "Design Homepage Mockup", time: "2 hours ago", status: "success" },
                { user: "Jane Smith", action: "started", task: "API Integration", time: "3 hours ago", status: "info" },
                { user: "Mike Johnson", action: "updated", task: "Database Schema", time: "5 hours ago", status: "warning" },
                { user: "Sarah Williams", action: "reviewed", task: "Code Review PR #234", time: "6 hours ago", status: "success" },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900 dark:text-white">{activity.user}</span>
                      {" "}<span className="text-gray-600 dark:text-gray-400">{activity.action}</span>{" "}
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{activity.task}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
                    activity.status === 'info' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                    'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Quick Actions</h2>
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/projects')}
                variant="primary"
                fullWidth
                icon={<Plus className="w-5 h-5" />}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
              >
                New Task
              </Button>
              <Button 
                variant="primary"
                fullWidth
                icon={<Play className="w-5 h-5" />}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
              >
                Start Timer
              </Button>
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="primary"
                fullWidth
                icon={<FileText className="w-5 h-5" />}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                View Reports
              </Button>
              <Button 
                variant="primary"
                fullWidth
                icon={<MessageSquare className="w-5 h-5" />}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Team Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Active Projects</h2>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/25">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-6">
            {[
              { name: "Website Redesign", progress: 75, team: 5, deadline: "Jan 30", status: "success" },
              { name: "Mobile App Development", progress: 45, team: 8, deadline: "Feb 15", status: "warning" },
              { name: "API Documentation", progress: 90, team: 3, deadline: "Jan 25", status: "success" },
            ].map((project, index) => (
              <div key={index} className="p-6 bg-gradient-to-r from-gray-50 to-purple-50/30 dark:from-gray-800/50 dark:to-purple-900/20 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{project.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.team} team members · Due {project.deadline}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    project.status === 'success' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' :
                    'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                  }`}>
                    {project.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 shadow-lg ${
                      project.status === 'success' 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 shadow-emerald-500/25' 
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/25'
                    }`} 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
