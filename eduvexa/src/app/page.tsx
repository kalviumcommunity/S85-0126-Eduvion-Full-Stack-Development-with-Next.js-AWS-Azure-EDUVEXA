"use client";

import { Button, Card, StatCard, Badge } from "@/components";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="hero-gradient rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">
          {isLoggedIn && user ? `Hi ${user.name} 👋` : "Welcome back, Team! 👋"}
        </h1>
        <p className="text-purple-100 text-lg">Track your work, collaborate with your team, and boost productivity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value="124"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          trend={{ value: 12, isPositive: true }}
          color="indigo"
        />
        <StatCard
          title="Completed"
          value="89"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatCard
          title="In Progress"
          value="28"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          trend={{ value: 5, isPositive: true }}
          color="yellow"
        />
        <StatCard
          title="Team Members"
          value="12"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          trend={{ value: 2, isPositive: true }}
          color="purple"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card title="Recent Activity" variant="bordered" className="lg:col-span-2">
          <div className="space-y-3">
            {[
              { user: "John Doe", action: "completed", task: "Design Homepage Mockup", time: "2 hours ago", status: "success" },
              { user: "Jane Smith", action: "started", task: "API Integration", time: "3 hours ago", status: "info" },
              { user: "Mike Johnson", action: "updated", task: "Database Schema", time: "5 hours ago", status: "warning" },
              { user: "Sarah Williams", action: "reviewed", task: "Code Review PR #234", time: "6 hours ago", status: "success" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {activity.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-gray-900">{activity.user}</span>
                    {" "}<span className="text-gray-600">{activity.action}</span>{" "}
                    <span className="font-medium text-indigo-600">{activity.task}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <Badge label={activity.status} variant={activity.status as any} size="sm" />
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" variant="bordered">
          <div className="space-y-3">
            <Button 
              label="New Task" 
              variant="primary" 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            />
            <Button 
              label="Start Timer" 
              variant="success" 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <Button 
              label="View Reports" 
              variant="outline" 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            <Button 
              label="Team Chat" 
              variant="secondary" 
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
            />
          </div>
        </Card>
      </div>

      {/* Project Progress */}
      <Card title="Active Projects" variant="default">
        <div className="space-y-4">
          {[
            { name: "Website Redesign", progress: 75, team: 5, deadline: "Jan 30", status: "success" },
            { name: "Mobile App Development", progress: 45, team: 8, deadline: "Feb 15", status: "warning" },
            { name: "API Documentation", progress: 90, team: 3, deadline: "Jan 25", status: "success" },
          ].map((project, index) => (
            <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{project.team} team members · Due {project.deadline}</p>
                </div>
                <Badge label={`${project.progress}%`} variant={project.status as any} />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
