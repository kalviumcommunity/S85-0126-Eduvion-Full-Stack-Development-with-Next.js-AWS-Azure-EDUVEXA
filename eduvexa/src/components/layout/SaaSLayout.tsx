"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut
} from 'lucide-react';

interface SaaSLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function SaaSLayout({ children, sidebar }: SaaSLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const scrollDirection = useScrollDirection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileOpen(false);
      setIsNotificationsOpen(false);
    };

    if (isProfileOpen || isNotificationsOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isProfileOpen, isNotificationsOpen]);

  // Professional navbar with hide/show on scroll
  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-300 ease-in-out
    ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}
    ${theme === 'light' 
      ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm' 
      : 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg'
    }
  `;

  // Fixed sidebar: 220px expanded, 64px collapsed
  const sidebarWidth = isSidebarCollapsed ? 64 : 220;
  
  const sidebarClasses = `
    fixed left-0 top-16 h-full z-40 transition-all duration-300 ease-in-out
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
    ${theme === 'light' 
      ? 'bg-white border-r border-gray-200/50 shadow-sm' 
      : 'bg-gray-900 border-r border-gray-800/50 shadow-lg'
    }
  `;

  // Main content area with proper margin for sidebar (no longer needed with flexbox)
  // const mainClasses = `
  //   flex-1 transition-all duration-300 ease-in-out
  //   md:ml-[${sidebarWidth}px]
  //   ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}
  // `;

  const notifications = [
    { id: 1, title: 'New assignment submitted', time: '2 min ago', read: false },
    { id: 2, title: 'Team meeting in 30 minutes', time: '28 min ago', read: false },
    { id: 3, title: 'Project milestone completed', time: '1 hour ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* TOP NAVBAR - Full width, sticky with hide/show */}
      <nav className={navbarClasses}>
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search Bar - Centered */}
            <div className="flex-1 max-w-lg mx-4 md:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                    theme === 'light'
                      ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                      : 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                  } focus:outline-none transition-all duration-200`}
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsNotificationsOpen(!isNotificationsOpen);
                  }}
                  className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className={`
                    absolute right-0 mt-2 w-80 rounded-xl shadow-xl
                    ${theme === 'light' 
                      ? 'bg-white border border-gray-200' 
                      : 'bg-gray-900 border border-gray-800'
                    }
                  `}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <h3 className={`font-semibold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`
                            p-3 border-b border-gray-100 dark:border-gray-800
                            hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer
                            ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              !notification.read ? 'bg-blue-500' : 'bg-transparent'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                theme === 'light' ? 'text-gray-900' : 'text-white'
                              }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs ${
                                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                              }`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JD</span>
                  </div>
                  <ChevronDown className="w-4 h-4 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className={`
                    absolute right-0 mt-2 w-56 rounded-xl shadow-xl
                    ${theme === 'light' 
                      ? 'bg-white border border-gray-200' 
                      : 'bg-gray-900 border border-gray-800'
                    }
                  `}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <p className={`font-semibold ${
                        theme === 'light' ? 'text-gray-900' : 'text-white'
                      }`}>
                        John Doe
                      </p>
                      <p className={`text-sm ${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        john.doe@eduvexa.com
                      </p>
                    </div>
                    <div className="p-2">
                      <button className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${theme === 'light' 
                          ? 'hover:bg-gray-100 text-gray-700' 
                          : 'hover:bg-gray-800 text-gray-300'
                        }
                      `}>
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${theme === 'light' 
                          ? 'hover:bg-gray-100 text-gray-700' 
                          : 'hover:bg-gray-800 text-gray-300'
                        }
                      `}>
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${theme === 'light' 
                          ? 'hover:bg-red-50 text-red-600' 
                          : 'hover:bg-red-900/20 text-red-400'
                        }
                      `}>
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT AREA WITH FLEXBOX LAYOUT */}
      <div className="flex pt-16">
        {/* SIDEBAR - Fixed 220px width */}
        {sidebar && (
          <aside 
            className={sidebarClasses}
            style={{ width: `${sidebarWidth}px` }}
          >
            <div className="flex flex-col h-full">
              {/* Logo Section */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  {!isSidebarCollapsed && (
                    <div>
                      <h1 className="text-lg font-semibold text-gray-900 dark:text-white">EDUVEXA</h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Tracker</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden md:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Content */}
              <nav className="flex-1 p-4 overflow-y-auto">
                {sidebar}
              </nav>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT - Flex:1, max-width 1280px, centered */}
        <main 
          className="flex-1 transition-all duration-300 ease-in-out"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="max-w-7xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
