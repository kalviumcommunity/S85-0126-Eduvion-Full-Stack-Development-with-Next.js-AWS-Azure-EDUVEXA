"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  LayoutDashboard,
  Users,
  User,
  Settings,
  ChevronRight,
  LogOut,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function UnifiedSidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { isLoggedIn, logout } = useAuth();

  // Navigation items based on authentication state
  const navItems: NavItem[] = isLoggedIn ? [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      href: '/dashboard'
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/student-progress'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: <MessageSquare className="w-5 h-5" />,
      href: '/peer-feedback'
    },
    {
      id: 'team',
      label: 'Team',
      icon: <Users className="w-5 h-5" />,
      href: '/users'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
      href: '/profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings'
    }
  ] : [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
      href: '/'
    },
    {
      id: 'login',
      label: 'Login',
      icon: <User className="w-5 h-5" />,
      href: '/login'
    },
    {
      id: 'signup',
      label: 'Sign Up',
      icon: <User className="w-5 h-5" />,
      href: '/signup'
    }
  ];

  return (
    <div className="space-y-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`
              group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${isActive
                ? theme === 'light'
                  ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-soft'
                  : 'bg-primary-900/20 text-primary-400 border border-primary-800'
                : theme === 'light'
                  ? 'text-gray-700 hover:bg-gray-100 hover:shadow-soft'
                  : 'text-gray-300 hover:bg-gray-800 hover:shadow-soft'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-5 h-5 flex items-center justify-center
              ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}
            `}>
              {item.icon}
            </div>

            {/* Text */}
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">
                {item.label}
              </span>
            )}

            {/* Active Indicator */}
            {isActive && !isCollapsed && (
              <div className="ml-auto">
                <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
            )}
          </Link>
        );
      })}
      
      {/* Logout button for authenticated users */}
      {isLoggedIn && !isCollapsed && (
        <button
          onClick={logout}
          className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full
            ${theme === 'light'
              ? 'text-error-600 hover:bg-error-50 border border-error-200 hover:shadow-soft'
              : 'text-error-400 hover:bg-error-900/20 border border-error-800 hover:shadow-soft'
            }
          `}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      )}
    </div>
  );
}
