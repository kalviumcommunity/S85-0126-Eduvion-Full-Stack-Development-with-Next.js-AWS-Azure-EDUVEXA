
"use client";

import { Card, Button, InputField } from "@/components";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, CheckCircle, Star } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  _count: {
    ownedProjects: number;
    assignedTasks: number;
    feedbackGiven: number;
    feedbackReceived: number;
  };
  completedTasks: number;
  averageRating: number;
  recentActivity: number;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, pagination.page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      const response = await fetch(`/api/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data.users);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "INSTRUCTOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Members</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage and track your team's performance</p>
        </div>
        <Button 
          label="Add Member" 
          variant="primary"
          onClick={() => router.push('/signup')}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Search Bar */}
      <InputField
        placeholder="Search team members by name or email..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
        icon={<Users className="w-5 h-5" />}
      />

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-3">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Members</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {users.reduce((sum, user) => sum + user.completedTasks, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Tasks Completed</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-3">
              <Star className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {users.length > 0 ? (users.reduce((sum, user) => sum + user.averageRating, 0) / users.length).toFixed(1) : '0.0'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-3">
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {users.reduce((sum, user) => sum + user.recentActivity, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Recent Activities</p>
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} variant="default" className="hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-500"></div>
              </div>

              {/* Member Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{user.role}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{user.email}</p>
                
                {/* Role Badge */}
                <div className="mb-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tasks</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{user.completedTasks}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{user.averageRating.toFixed(1)}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Joined {formatDate(user.createdAt)}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    label="View Profile" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.push(`/users/${user.id}`)}
                  />
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={() => router.push(`/peer-feedback?to=${user.id}`)}
                  >
                    <Star className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            label="Previous"
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          />
          <span className="flex items-center px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            label="Next"
            variant="outline"
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          />
        </div>
      )}

      {/* No Results */}
      {!loading && users.length === 0 && (
        <Card variant="bordered">
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No team members found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria</p>
          </div>
        </Card>
      )}
    </div>
  );
}
