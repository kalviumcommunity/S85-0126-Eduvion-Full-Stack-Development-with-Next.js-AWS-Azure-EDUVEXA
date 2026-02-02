"use client";

import { Bell, Menu, Sun, Moon, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import ProfessionalBadge from '@/components/ui/ProfessionalBadge';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onMenuToggle?: () => void;
  notifications?: number;
}

export default function Navbar({ 
  onMenuToggle, 
  notifications = 0 
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and menu toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-250 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">EDUVEXA</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student Tracking</p>
              </div>
            </Link>
          </div>

          {/* Center - Navigation links (desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/projects" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Projects
                </Link>
                <Link 
                  href="/users" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Team Members
                </Link>
                <Link 
                  href="/peer-feedback" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Feedback
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/#features" 
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  Features
                </Link>
              </>
            )}
          </div>

          {/* Right side - Theme toggle, notifications, auth buttons */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-250"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-250">
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <ProfessionalBadge 
                      variant="error" 
                      size="sm" 
                      className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0"
                    >
                      {notifications > 99 ? '99+' : notifications}
                    </ProfessionalBadge>
                  )}
                </button>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-250"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Auth buttons for non-logged in users */
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
