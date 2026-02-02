"use client";

import SaaSLayout from '@/components/layout/SaaSLayout';
import ProfessionalSidebar from '@/components/layout/ProfessionalSidebar';
import MainContent from '@/components/layout/MainContent';
import ProfessionalCard from '@/components/ui/ProfessionalCard';
import StatCard from '@/components/ui/StatCard';

export default function LayoutExample() {
  return (
    <SaaSLayout sidebar={<ProfessionalSidebar />}>
      <MainContent maxWidth="2xl">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome to your professional SaaS dashboard
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value="2,543"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Revenue"
              value="$45,231"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Active Projects"
              value="18"
              trend={{ value: 2, isPositive: false }}
            />
            <StatCard
              title="Completion Rate"
              value="94%"
              trend={{ value: 5, isPositive: true }}
            />
          </div>

          {/* Main Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProfessionalCard title="Recent Activity">
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">A{item}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          Activity item {item}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item} hour{item > 1 ? 's' : ''} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ProfessionalCard>
            </div>

            <div>
              <ProfessionalCard title="Quick Actions">
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    New Project
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Invite Team Member
                  </button>
                  <button className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    View Reports
                  </button>
                </div>
              </ProfessionalCard>
            </div>
          </div>
        </div>
      </MainContent>
    </SaaSLayout>
  );
}
