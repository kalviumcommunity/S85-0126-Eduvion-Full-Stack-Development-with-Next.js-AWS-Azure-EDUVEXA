"use client";

import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Award,
  BarChart3,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
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
    href: '/students',
    badge: '24'
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: <BookOpen className="w-5 h-5" />,
    href: '/courses'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: <Calendar className="w-5 h-5" />,
    href: '/schedule'
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: <Award className="w-5 h-5" />,
    href: '/achievements'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics'
  },
  {
    id: 'feedback',
    label: 'Peer Feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    href: '/peer-feedback',
    badge: '5'
  }
];

const secondaryItems: NavItem[] = [
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

export default function NavigationSidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const linkClasses = (active: boolean) => `
    flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
    transition-all duration-200 group
    ${active
      ? theme === 'light'
        ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-600'
        : 'bg-primary-900/20 text-primary-400 border-l-2 border-primary-600'
      : theme === 'light'
        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
    }
    ${isCollapsed ? 'justify-center' : ''}
  `;

  const iconClasses = (active: boolean) => `
    flex-shrink-0 w-5 h-5
    ${active 
      ? 'text-primary-600 dark:text-primary-400' 
      : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
    }
  `;

  return (
    <nav className="h-full flex flex-col py-4">
      {/* Main Navigation */}
      <div className="flex-1">
        {!isCollapsed && (
          <div className="px-3 mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </h3>
          </div>
        )}
        
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={linkClasses(active)}
              >
                <span className={iconClasses(active)}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        {!isCollapsed && (
          <div className="px-3 mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Secondary
            </h3>
          </div>
        )}
        
        <div className="space-y-1 px-2">
          {secondaryItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={linkClasses(active)}
              >
                <span className={iconClasses(active)}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
