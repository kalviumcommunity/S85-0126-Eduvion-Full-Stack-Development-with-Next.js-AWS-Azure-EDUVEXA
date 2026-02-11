"use client";

import { Card } from "@/components";
import { WeeklyActivityDashboard } from "./WeeklyActivityDashboard";
import { useState, useEffect } from 'react';

export default function WeeklyActivityPage() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await fetchUsers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Failed to load team members:', error);
      }
    };

    const loadActivities = async () => {
      try {
        const activityData = await fetchWeeklyActivity();
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to load activities:', error);
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadTeamMembers(), loadActivities()]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchUsers, fetchWeeklyActivity]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-200 to-blue-400 flex flex-col items-center py-12">
      <div className="w-full max-w-6xl">
        {/* Modern Header */}
        <div className="mb-8 text-center">
          <span className="inline-block px-5 py-2 rounded-full bg-cyan-600 text-white font-bold text-lg shadow-lg tracking-wide animate-fade-in">Weekly Activity Report</span>
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 drop-shadow-lg">Performance Overview</h1>
          <p className="mt-2 text-lg text-gray-600">Track your team's weekly progress, revenue, and engagement metrics in style.</p>
        </div>
        <Card title="" variant="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Revenues Bar Chart */}
            <div className="transition-transform hover:scale-[1.03]">
              <h2 className="text-xl font-bold text-cyan-700 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m4 0v-4a2 2 0 012-2h2a2 2 0 012 2v4" /></svg>
                fetchProjects, fetchUsers
              </h2>
              <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-100 shadow-lg p-4 animate-fade-in">
                <WeeklyActivityDashboard />
              </div>
            </div>
            {/* Sessions & Conversion Performance Line Chart */}
            <div className="transition-transform hover:scale-[1.03]">
              <h2 className="text-xl font-bold text-pink-700 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                Sessions & Conversion Performance
              </h2>
              <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-center h-64 animate-fade-in">
                <span className="text-gray-400 text-lg font-semibold">[Line Chart Coming Soon]</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
            {/* Cost Per Click Gauge */}
            <div className="flex flex-col items-center transition-transform hover:scale-105">
              <h3 className="text-md font-bold text-yellow-700 mb-2">Cost Per Click (CPC)</h3>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full shadow-lg p-8 flex items-center justify-center w-44 h-44 border-4 border-yellow-400">
                <span className="text-3xl font-extrabold text-yellow-700">$3.76</span>
              </div>
            </div>
            {/* Transactions Card */}
            <div className="flex flex-col items-center transition-transform hover:scale-105">
              <h3 className="text-md font-bold text-green-700 mb-2">Transactions</h3>
              <div className="bg-gradient-to-br from-green-50 to-green-200 rounded-xl shadow-lg p-8 flex flex-col items-center w-44 border-4 border-green-300">
                <span className="text-4xl font-extrabold text-green-700">35,567</span>
                <span className="text-xs text-gray-400 mt-2">Previous period: 0%</span>
              </div>
            </div>
            {/* Impressions Card */}
            <div className="flex flex-col items-center transition-transform hover:scale-105">
              <h3 className="text-md font-bold text-blue-700 mb-2">Impressions</h3>
              <div className="bg-gradient-to-br from-blue-50 to-blue-200 rounded-xl shadow-lg p-8 flex flex-col items-center w-44 border-4 border-blue-300">
                <span className="text-4xl font-extrabold text-blue-700">252,292</span>
                <span className="text-xs text-gray-400 mt-2">Previous year: 34%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
