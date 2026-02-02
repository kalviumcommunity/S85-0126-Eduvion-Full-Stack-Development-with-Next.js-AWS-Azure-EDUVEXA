"use client";

import { useState } from 'react';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Moon, 
  Sun,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface SmartNavbarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function SmartNavbar({ onMenuToggle, isMenuOpen }: SmartNavbarProps) {
  const scrollDirection = useScrollDirection();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New assignment submitted', time: '2 min ago', read: false },
    { id: 2, title: 'Team meeting in 30 minutes', time: '28 min ago', read: false },
    { id: 3, title: 'Project milestone completed', time: '1 hour ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-300 ease-in-out
    ${scrollDirection === 'down' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
    ${theme === 'light' 
      ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' 
      : 'bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 shadow-lg'
    }
  `;

  return (
    <>
      <nav className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuToggle}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${theme === 'light' 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'hover:bg-gray-800 text-gray-300'
                  }
                `}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${theme === 'light' 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-400 to-purple-500'
                  }
                `}>
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <h1 className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    EDUVEXA
                  </h1>
                  <p className={`text-xs ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Smart Education Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <div className={`
                  absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none
                  transition-all duration-200 ${showSearch ? 'opacity-0' : 'opacity-100'}
                `}>
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students, courses, assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                  className={`
                    w-full pl-10 pr-4 py-2 
                    rounded-xl border 
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20
                    ${theme === 'light' 
                      ? 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500' 
                      : 'bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-400 focus:bg-gray-800 focus:border-blue-400'
                    }
                  `}
                />
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${theme === 'light' 
                    ? 'hover:bg-gray-100 text-gray-700' 
                    : 'hover:bg-gray-800 text-gray-300'
                  }
                `}
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`
                    p-2 rounded-lg transition-all duration-200 relative
                    ${theme === 'light' 
                      ? 'hover:bg-gray-100 text-gray-700' 
                      : 'hover:bg-gray-800 text-gray-300'
                    }
                  `}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
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
                            p-4 border-b border-gray-100 dark:border-gray-800
                            hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
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
                  onClick={() => setShowProfile(!showProfile)}
                  className={`
                    flex items-center gap-2 p-2 rounded-lg transition-all duration-200
                    ${theme === 'light' 
                      ? 'hover:bg-gray-100 text-gray-700' 
                      : 'hover:bg-gray-800 text-gray-300'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
                    ${theme === 'light' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                      : 'bg-gradient-to-br from-purple-400 to-pink-400 text-white'
                    }
                  `}>
                    JD
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                {showProfile && (
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
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </>
  );
}
