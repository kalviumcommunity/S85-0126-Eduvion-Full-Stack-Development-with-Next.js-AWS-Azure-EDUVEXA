"use client";

import { useState } from "react";
import { Card, StatCard, Badge, Button } from "@/components";
import { useRouter } from "next/navigation";

export default function StudentProgressPage() {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const students = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      course: "Computer Science",
      semester: "Fall 2024",
      overallProgress: 85,
      engagementScore: 92,
      assignmentsCompleted: 18,
      totalAssignments: 20,
      averageGrade: "A-",
      lastActive: "2 hours ago",
      strengths: ["Problem Solving", "Algorithm Design", "Team Collaboration"],
      improvements: ["Documentation", "Time Management"],
      recentActivity: [
        { type: "assignment", title: "Data Structures Project", status: "completed", date: "2024-01-28" },
        { type: "quiz", title: "Algorithms Quiz #3", status: "completed", date: "2024-01-27" },
        { type: "discussion", title: "Week 4 Discussion Forum", status: "participated", date: "2024-01-26" }
      ]
    },
    {
      id: "2", 
      name: "Bob Smith",
      email: "bob@example.com",
      course: "Software Engineering",
      semester: "Fall 2024",
      overallProgress: 72,
      engagementScore: 68,
      assignmentsCompleted: 14,
      totalAssignments: 20,
      averageGrade: "B+",
      lastActive: "1 day ago",
      strengths: ["Code Quality", "Testing", "Version Control"],
      improvements: ["Participation", "Meeting Deadlines"],
      recentActivity: [
        { type: "assignment", title: "Web Development Project", status: "in-progress", date: "2024-01-28" },
        { type: "quiz", title: "Database Design Quiz", status: "completed", date: "2024-01-25" },
        { type: "peer-review", title: "Code Review - Team Project", status: "completed", date: "2024-01-24" }
      ]
    },
    {
      id: "3",
      name: "Charlie Brown",
      email: "charlie@example.com", 
      course: "Data Science",
      semester: "Fall 2024",
      overallProgress: 90,
      engagementScore: 95,
      assignmentsCompleted: 19,
      totalAssignments: 20,
      averageGrade: "A",
      lastActive: "30 minutes ago",
      strengths: ["Data Analysis", "Machine Learning", "Visualization"],
      improvements: ["Statistical Theory", "Research Writing"],
      recentActivity: [
        { type: "assignment", title: "ML Model Implementation", status: "completed", date: "2024-01-28" },
        { type: "presentation", title: "Data Visualization Project", status: "completed", date: "2024-01-27" },
        { type: "lab", title: "Statistical Analysis Lab", status: "completed", date: "2024-01-26" }
      ]
    }
  ];

  const selectedStudentData = students.find(s => s.id === selectedStudent);

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'assignment':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>;
      case 'quiz':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>;
      case 'discussion':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>;
      case 'presentation':
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4" />
        </svg>;
      default:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'participated': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Progress Tracking</h1>
          <p className="text-gray-600 dark:text-gray-300">Monitor student engagement and academic performance</p>
        </div>
        <Button 
          label="Generate Report" 
          variant="primary"
          onClick={() => alert('Generating comprehensive progress report...')}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v8m5-4h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="primary"
        />
        <StatCard
          title="Avg Progress"
          value={`${Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length)}%`}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          color="success"
        />
        <StatCard
          title="Avg Engagement"
          value={`${Math.round(students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length)}%`}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          color="secondary"
        />
        <StatCard
          title="At Risk Students"
          value={students.filter(s => s.overallProgress < 75).length}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-1">
          <Card title="Students" variant="bordered">
            <div className="space-y-3">
              {students.map((student) => (
                <div 
                  key={student.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedStudent === student.id 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedStudent(student.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                    <Badge 
                      label={`${student.overallProgress}%`} 
                      variant={student.overallProgress >= 80 ? 'success' : student.overallProgress >= 60 ? 'warning' : 'error'}
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{student.course}</p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Grade: {student.averageGrade}</span>
                    <span>{student.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-2">
          {selectedStudentData ? (
            <div className="space-y-6">
              {/* Student Info Card */}
              <Card title="Student Details" variant="gradient">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{selectedStudentData.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedStudentData.email}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Course:</span>
                        <span className="text-sm font-medium">{selectedStudentData.course}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Semester:</span>
                        <span className="text-sm font-medium">{selectedStudentData.semester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Average Grade:</span>
                        <span className="text-sm font-medium">{selectedStudentData.averageGrade}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm font-medium">{selectedStudentData.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full" 
                          style={{ width: `${selectedStudentData.overallProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Engagement Score</span>
                        <span className="text-sm font-medium">{selectedStudentData.engagementScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full" 
                          style={{ width: `${selectedStudentData.engagementScore}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Assignments</span>
                        <span className="text-sm font-medium">{selectedStudentData.assignmentsCompleted}/{selectedStudentData.totalAssignments}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" 
                          style={{ width: `${(selectedStudentData.assignmentsCompleted / selectedStudentData.totalAssignments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Strengths" variant="bordered">
                  <div className="space-y-2">
                    {selectedStudentData.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card title="Areas for Improvement" variant="bordered">
                  <div className="space-y-2">
                    {selectedStudentData.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card title="Recent Activity" variant="bordered">
                <div className="space-y-3">
                  {selectedStudentData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</p>
                      </div>
                      <Badge 
                        label={activity.status} 
                        variant={getStatusColor(activity.status) as any}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  label="Send Feedback" 
                  variant="primary"
                  onClick={() => alert(`Opening feedback form for ${selectedStudentData.name}...`)}
                />
                <Button 
                  label="Schedule Meeting" 
                  variant="outline"
                  onClick={() => alert(`Scheduling meeting with ${selectedStudentData.name}...`)}
                />
                <Button 
                  label="View Full Profile" 
                  variant="secondary"
                  onClick={() => router.push(`/users/${selectedStudentData.id}`)}
                />
              </div>
            </div>
          ) : (
            <Card variant="bordered">
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select a Student</h3>
                <p className="text-gray-600 dark:text-gray-300">Choose a student from the list to view detailed progress information</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
