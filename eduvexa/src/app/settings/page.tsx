"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Globe, Database, HelpCircle } from "lucide-react";
import ProfessionalCard from "@/components/ui/ProfessionalCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Settings' }
  ];

  const settingsSections = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'language', label: 'Language', icon: <Globe className="w-5 h-5" /> },
    { id: 'data', label: 'Data & Privacy', icon: <Database className="w-5 h-5" /> },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage your account preferences</p>
      </div>

      {/* Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <ProfessionalCard>
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {section.icon}
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </ProfessionalCard>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <ProfessionalCard>
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@eduvexa.com"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                        <option>Administrator</option>
                        <option>Teacher</option>
                        <option>Student</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your account</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors">
                      <span className="translate-x-6 bg-white dark:bg-gray-900 rounded-full w-5 h-5 transition-transform"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Push Notifications</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in your browser</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors">
                      <span className="translate-x-6 bg-white rounded-full w-5 h-5 transition-transform"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Assignment Reminders</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get reminded about upcoming deadlines</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500 transition-colors">
                      <span className="translate-x-6 bg-white rounded-full w-5 h-5 transition-transform"></span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Enable
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Password</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Change
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Light</option>
                      <option>Dark</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                      <option>Small</option>
                      <option>Medium</option>
                      <option>Large</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </ProfessionalCard>
        </div>
      </div>
    </div>
  );
}
