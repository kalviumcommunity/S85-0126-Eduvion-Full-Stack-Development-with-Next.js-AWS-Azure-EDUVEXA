"use client";

import { Card, StatCard, Badge } from "@/components";
                      import { useState } from "react";
                      import { hasPermission } from "@/lib/rbacConfig";
                      import { useAuth } from "@/hooks/useAuth";

                      function WeeklyActivityDashboard() {
                        const data = [
                          { day: "Monday", value: 4200, details: "High productivity, 5 tasks completed." },
                          { day: "Tuesday", value: 3600, details: "Team meeting, 4 tasks completed." },
                          { day: "Wednesday", value: 3800, details: "Client call, 6 tasks completed." },
                          { day: "Thursday", value: 3800, details: "Code review, 5 tasks completed." },
                          { day: "Friday", value: 3600, details: "Documentation, 3 tasks completed." },
                          { day: "Saturday", value: 3200, details: "Bug fixes, 2 tasks completed." },
                          { day: "Sunday", value: 2900, details: "Planning, 1 task completed." },
                        ];
                        const max = Math.max(...data.map(d => d.value));
                        const [selected, setSelected] = useState<number | null>(null);

                        return (
                          <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="relative w-full h-64">
                              <svg viewBox="0 0 700 260" className="absolute left-0 top-0 w-full h-full">
                                {/* Grid lines and y-axis ticks */}
                                {Array.from({ length: 6 }).map((_, i) => {
                                  const y = 40 + i * 36;
                                  const value = 5200 - i * 800;
                                  return (
                                    <g key={i}>
                                      <line x1="60" x2="680" y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4 4" />
                                      <text x="50" y={y + 5} fontSize="12" fill="#9ca3af" textAnchor="end">{value}</text>
                                    </g>
                                  );
                                })}
                                {/* Bars */}
                                {data.map((item, i) => {
                                  const barHeight = ((item.value / max) * 180) || 2;
                                  const y = 220 - barHeight;
                                  const x = 70 + i * 85;
                                  const isActive = selected === i;
                                  return (
                                    <g key={item.day}>
                                      <rect
                                        x={x}
                                        y={y}
                                        width="50"
                                        height={barHeight}
                                        fill={isActive ? "#14b8a6" : "#38bdf8"}
                                        opacity={isActive ? "0.9" : "0.7"}
                                        rx="4"
                                        style={{ cursor: "pointer", transition: "fill 0.2s" }}
                                        onClick={() => setSelected(isActive ? null : i)}
                                      />
                                      {/* Value label on top of bar */}
                                      <text
                                        x={x + 25}
                                        y={y - 10}
                                        fontSize="13"
                                        fill={isActive ? "#14b8a6" : "#38bdf8"}
                                        textAnchor="middle"
                                        fontWeight="bold"
                                      >
                                        {item.value}
                                      </text>
                                    </g>
                                  );
                                })}
                                {/* X-axis labels */}
                                {data.map((item, i) => (
                                  <text
                                    key={item.day}
                                    x={95 + i * 85}
                                    y={245}
                                    fontSize="13"
                                    fill="#6b7280"
                                    textAnchor="middle"
                                    transform={`rotate(-25,${95 + i * 85},245)`}
                                  >
                                    {item.day}
                                  </text>
                                ))}
                                {/* Y-axis label */}
                                <text x="20" y="20" fontSize="13" fill="#9ca3af">Revenues</text>
                              </svg>
                            </div>
                            {/* Details below chart */}
                            {selected !== null && (
                              <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200 text-cyan-900 shadow">
                                <span className="font-semibold">{data[selected].day}:</span> {data[selected].details}
                              </div>
                            )}
                          </div>
                        );
                      }

                      export default function DashboardPage() {
                        const { user } = useAuth();
                        return (
                          <div className="space-y-8">
                            {/* Role Banner - shows difference between ADMIN and normal user */}
                            {user && (
                              <div className="mb-6">
                                <div className="px-4 py-2 rounded-lg font-semibold text-white"
                                  style={{ background: user.role === "ADMIN" ? "#4f46e5" : user.role === "editor" ? "#6366f1" : "#64748b" }}>
                                  {user.role === "ADMIN"
                                    ? "You are logged in as: ADMIN (Full Access)"
                                    : user.role === "editor"
                                    ? "You are logged in as: Editor (Limited Access)"
                                    : "You are logged in as: Viewer (Read Only)"}
                                </div>
                              </div>
                            )}
                            {/* Page Header */}
                            <div>
                              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                              <p className="text-gray-600">Overview of your work activities and performance metrics</p>
                            </div>
                            {/* Performance Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <StatCard
                                title="Hours This Week"
                                value="38.5h"
                                icon={
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                }
                                trend={{ value: 15, isPositive: true }}
                                color="indigo"
                              />
                              <StatCard
                                title="Tasks Completed"
                                value="24"
                                icon={
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                }
                                trend={{ value: 20, isPositive: true }}
                                color="green"
                              />
                              <StatCard
                                title="Productivity Score"
                                value="94%"
                                icon={
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                }
                                trend={{ value: 5, isPositive: true }}
                                color="purple"
                              />
                              <StatCard
                                title="Pending Reviews"
                                value="3"
                                icon={
                                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                }
                                trend={{ value: 2, isPositive: false }}
                                color="yellow"
                              />
                            </div>
                            {/* Today's Schedule & Task Distribution */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Today's Schedule */}
                              <Card title="Today's Schedule" variant="gradient">
                                <div className="space-y-3">
                                  {([
                                    { time: "09:00 AM", task: "Team Standup Meeting", duration: "30 min", type: "meeting" },
                                    { time: "10:00 AM", task: "Complete API Documentation", duration: "2 hours", type: "development" },
                                    { time: "01:00 PM", task: "Code Review Session", duration: "1 hour", type: "review" },
                                    { time: "03:00 PM", task: "Client Presentation", duration: "45 min", type: "meeting" },
                                    { time: "04:30 PM", task: "Bug Fixes & Testing", duration: "1.5 hours", type: "development" },
                                  ]).map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                                      <div className="flex-shrink-0 w-20 text-sm font-semibold text-indigo-600">
                                        {item.time}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.task}</p>
                                        <p className="text-xs text-gray-500">{item.duration}</p>
                                      </div>
                                      <Badge 
                                        label={item.type} 
                                        variant={item.type === 'meeting' ? 'info' : item.type === 'review' ? 'warning' : 'success'} 
                                        size="sm" 
                                      />
                                    </div>
                                  ))}
                                </div>
                              </Card>
                              {/* Task Distribution */}
                              <Card title="Task Distribution" variant="bordered">
                                <div className="space-y-4">
                                  {([
                                    { category: "Development", count: 12, color: "bg-indigo-500", percentage: 40 },
                                    { category: "Code Review", count: 5, color: "bg-purple-500", percentage: 20 },
                                    { category: "Meetings", count: 8, color: "bg-pink-500", percentage: 25 },
                                    { category: "Documentation", count: 4, color: "bg-green-500", percentage: 15 },
                                  ]).map((item, index) => (
                                    <div key={index}>
                                      <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                          <span className="font-medium text-gray-900">{item.category}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                          <span className="text-sm text-gray-600">{item.count} tasks</span>
                                          <span className="text-sm font-semibold text-indigo-600">{item.percentage}%</span>
                                        </div>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                          style={{ width: `${item.percentage}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            </div>
                            {/* Modern dashboard style with clickable bars */}
                            <WeeklyActivityDashboard />
                            {/* Link to Weekly Activity Page */}
                            <div className="flex justify-center mt-12">
                              <a
                                href="/weekly-activity"
                                className="inline-block px-6 py-3 bg-cyan-600 text-white font-semibold rounded-lg shadow hover:bg-cyan-700 transition"
                              >
                                View Full Weekly Activity Report
                              </a>
                            </div>
                            {/* Create New Project Button */}
                            {user && hasPermission(user.role, "create") && (
                              <div className="flex justify-end mb-4">
                                <a href="/projects/new">
                                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition">
                                    Create New Project
                                  </button>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      }
