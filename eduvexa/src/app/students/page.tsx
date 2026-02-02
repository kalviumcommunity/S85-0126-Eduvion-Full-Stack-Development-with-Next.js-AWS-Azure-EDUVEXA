"use client";

import { useState, useEffect } from "react";
import { Users, Plus, Search, Filter } from "lucide-react";
import ProfessionalCard from "@/components/ui/ProfessionalCard";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface Student {
  id: string;
  name: string;
  email: string;
  enrolledCourses: number;
  progress: number;
  status: 'active' | 'inactive';
  joinDate: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStudents([
        {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice.johnson@eduvexa.com',
          enrolledCourses: 5,
          progress: 78,
          status: 'active',
          joinDate: '2024-01-15'
        },
        {
          id: '2',
          name: 'Bob Smith',
          email: 'bob.smith@eduvexa.com',
          enrolledCourses: 3,
          progress: 65,
          status: 'active',
          joinDate: '2024-01-20'
        },
        {
          id: '3',
          name: 'Carol Davis',
          email: 'carol.davis@eduvexa.com',
          enrolledCourses: 7,
          progress: 92,
          status: 'active',
          joinDate: '2024-01-10'
        },
        {
          id: '4',
          name: 'David Wilson',
          email: 'david.wilson@eduvexa.com',
          enrolledCourses: 4,
          progress: 45,
          status: 'inactive',
          joinDate: '2024-02-01'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Students' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage and track student progress</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search and Filters */}
      <ProfessionalCard>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </ProfessionalCard>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} variant="rounded" height={200} />
          ))
        ) : (
          filteredStudents.map((student) => (
            <ProfessionalCard key={student.id} hover={true}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{student.email}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{student.enrolledCourses}</span> courses
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Joined {student.joinDate}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  student.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {student.status}
                </span>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  View Details
                </button>
              </div>
            </ProfessionalCard>
          ))
        )}
      </div>

      {filteredStudents.length === 0 && !isLoading && (
        <ProfessionalCard>
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No students found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        </ProfessionalCard>
      )}
    </div>
  );
}
