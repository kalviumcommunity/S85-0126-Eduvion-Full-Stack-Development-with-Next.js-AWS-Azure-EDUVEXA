"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface ModernSidebarProps {
  className?: string;
}

export default function ModernSidebar({ className = '' }: ModernSidebarProps) {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/dashboard'
    },
    {
      id: 'team',
      label: 'Team Members',
      icon: <Users className="w-5 h-5" />,
      href: '/team'
    },
    {
      id: 'tasks',
      label: 'Tasks & Projects',
      icon: <CheckSquare className="w-5 h-5" />,
      href: '/tasks'
    },
    {
      id: 'timesheets',
      label: 'Timesheets',
      icon: <Clock className="w-5 h-5" />,
      href: '/timesheets'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-5 h-5" />,
      href: '/reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings'
    }
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const sidebarClasses = `
    fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
    ${isMobile ? 'w-64' : isCollapsed ? 'w-16' : 'w-56'}
    ${isMobile ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
    ${theme === 'light' 
      ? 'bg-white/95 backdrop-blur-xl border-r border-gray-200/50 shadow-xl' 
      : 'bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50 shadow-2xl'
    }
    ${className}
  `;

  const overlayClasses = `
    fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden
    ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      <div className={overlayClasses} onClick={closeMobileSidebar} />

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`
              w-8 h-8 rounded-xl flex items-center justify-center
              ${theme === 'light' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
              }
            `}>
              <span className="text-white font-bold text-sm">E</span>
            </div>
            {(!isMobile && !isCollapsed) && (
              <div>
                <h1 className={`text-lg font-bold ${
                  theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}>
                  EDUVEXA
                </h1>
                <p className={`text-xs ${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Student Tracker
                </p>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className={`
              p-2 rounded-xl transition-all duration-200
              ${theme === 'light' 
                ? 'hover:bg-gray-100 text-gray-600 hover:text-gray-900' 
                : 'hover:bg-gray-800 text-gray-400 hover:text-gray-200'
              }
            `}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isMobile ? (
              isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />
            ) : (
              isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                  ${isActive 
                    ? theme === 'light' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg shadow-blue-400/25'
                    : theme === 'light'
                      ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                  }
                `}
                onClick={closeMobileSidebar}
              >
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-5 h-5 flex items-center justify-center
                  ${isActive ? 'text-white' : ''}
                `}>
                  {item.icon}
                </div>

                {/* Text - Hidden when collapsed or on mobile */}
                {(!isMobile && !isCollapsed) && (
                  <span className="font-medium truncate">
                    {item.label}
                  </span>
                )}

                {/* Tooltip - Only shown when collapsed on desktop */}
                {(!isMobile && isCollapsed) && (
                  <div className={`
                    absolute left-full ml-2 px-2 py-1 rounded-lg text-sm font-medium whitespace-nowrap
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50
                    ${theme === 'light' 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-900'
                    }
                  `}>
                    {item.label}
                    {/* Tooltip Arrow */}
                    <div className={`
                      absolute right-0 top-1/2 -translate-y-1/2 translate-x-1
                      w-2 h-2 rotate-45
                      ${theme === 'light' 
                        ? 'bg-gray-900' 
                        : 'bg-gray-100'
                      }
                    `} />
                  </div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-800/50">
          {(!isMobile && !isCollapsed) && (
            <div className="text-center">
              <p className={`text-xs ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Version 1.0.0
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
