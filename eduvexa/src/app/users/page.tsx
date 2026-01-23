"use client";

import { Card, Button, Badge, InputField } from "@/components";
import { useState } from "react";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const teamMembers = [
    { 
      id: 1, 
      name: "Subhadeep Samanta", 
      role: "Frontend Developer and Database Designer", 
      email: "subhadeep@example.com", 
      status: "active",
      tasksCompleted: 45,
      hoursThisWeek: 38,
      avatar: "SS"
    },
    { 
      id: 2, 
      name: "Aman Rohilla", 
      role: "Backend Developer", 
      email: "aman@example.com", 
      status: "active",
      tasksCompleted: 52,
      hoursThisWeek: 40,
      avatar: "AR"
    },
    { 
      id: 3, 
      name: "Nikhil Farand", 
      role: "DevOps", 
      email: "nikhil@example.com", 
      status: "active",
      tasksCompleted: 38,
      hoursThisWeek: 35,
      avatar: "NF"
    },
    { 
      id: 4, 
      name: "Sarah Williams", 
      role: "Project Manager", 
      email: "sarah@example.com", 
      status: "offline",
      tasksCompleted: 41,
      hoursThisWeek: 42,
      avatar: "SW"
    },
    { 
      id: 5, 
      name: "David Brown", 
      role: "Full Stack Developer", 
      email: "david@example.com", 
      status: "offline",
      tasksCompleted: 49,
      hoursThisWeek: 39,
      avatar: "DB"
    },
    { 
      id: 6, 
      name: "Emily Davis", 
      role: "QA Engineer", 
      email: "emily@example.com", 
      status: "offline",
      tasksCompleted: 36,
      hoursThisWeek: 32,
      avatar: "ED"
    },
  ];

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Members</h1>
          <p className="text-gray-600">Manage and track your team's performance</p>
        </div>
        <Button 
          label="Add Member" 
          variant="primary"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          }
        />
      </div>

      {/* Search Bar */}
      <InputField
        placeholder="Search team members by name or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teamMembers.length}</p>
            <p className="text-sm text-gray-600">Total Members</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teamMembers.filter(m => m.status === 'active').length}</p>
            <p className="text-sm text-gray-600">Active Now</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}</p>
            <p className="text-sm text-gray-600">Tasks Completed</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teamMembers.reduce((sum, m) => sum + m.hoursThisWeek, 0)}</p>
            <p className="text-sm text-gray-600">Hours This Week</p>
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} variant="default" className="hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {member.avatar}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  member.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>

              {/* Member Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                <p className="text-xs text-gray-500 mb-3">{member.email}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-indigo-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Tasks</p>
                    <p className="text-lg font-bold text-indigo-600">{member.tasksCompleted}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-xs text-gray-600">Hours</p>
                    <p className="text-lg font-bold text-purple-600">{member.hoursThisWeek}h</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button label="View Profile" variant="outline" size="sm" />
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredMembers.length === 0 && (
        <Card variant="bordered">
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        </Card>
      )}
    </div>
  );
}
