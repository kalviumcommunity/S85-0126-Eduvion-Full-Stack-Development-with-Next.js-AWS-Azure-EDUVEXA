"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, InputField } from "@/components";
import { Plus, Target, Clock, CheckCircle, Users, Calendar } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  ownerId: number;
  owner: {
    name: string;
    email: string;
  };
  _count: {
    tasks: number;
  };
  tasks: {
    _count: {
      id: number;
    };
    where: {
      status: string;
    };
  }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, filterStatus]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus,
      });
      
      const response = await fetch(`/api/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data.projects);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "ON_HOLD":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectStats = (project: Project) => {
    const totalTasks = project._count.tasks;
    const completedTasks = project.tasks.find(t => t.where.status === "COMPLETED")?._count.id || 0;
    const inProgressTasks = project.tasks.find(t => t.where.status === "IN_PROGRESS")?._count.id || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate
    };
  };

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage and track project progress</p>
        </div>
        <Button 
          label="New Project" 
          variant="primary"
          onClick={() => router.push('/projects/new')}
          icon={<Plus className="w-5 h-5" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <InputField
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Target className="w-5 h-5" />}
          className="flex-1"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
      </div>

      {/* Projects Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white mb-3">
              <Target className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Projects</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {projects.filter(p => p.status === "COMPLETED").length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Completed</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white mb-3">
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {projects.filter(p => p.status === "ACTIVE").length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">In Progress</p>
          </div>
        </Card>
        <Card variant="gradient" className="text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-3">
              <Users className="w-8 h-8" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {projects.reduce((sum, p) => sum + p._count.tasks, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Tasks</p>
          </div>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const stats = getProjectStats(project);
          
          return (
            <Card key={project.id} variant="default" className="hover:shadow-xl transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      by {project.owner.name}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Description */}
                {project.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {project.description}
                  </p>
                )}

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Tasks</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completedTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Done</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgressTasks}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Created {formatDate(project.createdAt)}
                  </div>
                  <Button 
                    label="View Details" 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* No Results */}
      {!loading && projects.length === 0 && (
        <Card variant="bordered">
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || filterStatus !== "ALL" 
                ? "Try adjusting your search or filters" 
                : "Get started by creating your first project"}
            </p>
            {!searchTerm && filterStatus === "ALL" && (
              <Button 
                label="Create Project" 
                variant="primary"
                onClick={() => router.push('/projects/new')}
                icon={<Plus className="w-5 h-5" />}
              />
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
