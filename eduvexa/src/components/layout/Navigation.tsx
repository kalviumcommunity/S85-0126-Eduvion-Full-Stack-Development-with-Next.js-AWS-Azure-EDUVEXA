"use client";

import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/dashboard'
  },
  {
    id: 'students',
    label: 'Students',
    icon: <Users className="w-5 h-5" />,
    href: '/students'
  },
  {
    id: 'tasks',
    label: 'Tasks',
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

export default function Navigation({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <div className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <a
            key={item.id}
            href={item.href}
            className={`
              group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
              ${isActive
                ? theme === 'light'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-blue-900/20 text-blue-400 border border-blue-800'
                : theme === 'light'
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            {/* Icon */}
            <div className={`
              flex-shrink-0 w-5 h-5 flex items-center justify-center
              ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}
            `}>
              {item.icon}
            </div>

            {/* Text */}
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">
                {item.label}
              </span>
            )}

            {/* Active indicator */}
            {isActive && (
              <div className="ml-auto">
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}
