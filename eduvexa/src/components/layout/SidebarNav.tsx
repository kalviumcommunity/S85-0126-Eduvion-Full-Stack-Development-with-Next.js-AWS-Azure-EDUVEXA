import { 
  Home, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  FileText,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

interface SidebarNavProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
  collapsed?: boolean;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    badge: null,
  },
  {
    id: 'students',
    label: 'Students',
    icon: <Users className="w-5 h-5" />,
    badge: '24',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <FolderOpen className="w-5 h-5" />,
    badge: '12',
  },
  {
    id: 'feedback',
    label: 'Peer Feedback',
    icon: <MessageSquare className="w-5 h-5" />,
    badge: '5',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    badge: null,
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: <BookOpen className="w-5 h-5" />,
    badge: null,
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: <Calendar className="w-5 h-5" />,
    badge: null,
  },
  {
    id: 'achievements',
    label: 'Achievements',
    icon: <Award className="w-5 h-5" />,
    badge: null,
  },
];

const secondaryItems = [
  {
    id: 'reports',
    label: 'Reports',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

export default function SidebarNav({ 
  activeItem = 'dashboard', 
  onItemClick, 
  collapsed = false 
}: SidebarNavProps) {
  return (
    <nav className="h-full flex flex-col">
      {/* Main Navigation */}
      <div className="flex-1 py-4">
        <div className="px-3 mb-6">
          <h3 className={`text-xs font-semibold text-neutral-500 uppercase tracking-wider ${
            collapsed ? 'text-center' : ''
          }`}>
            {collapsed ? 'M' : 'Main'}
          </h3>
        </div>
        
        <ul className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick?.(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-250 group
                  ${activeItem === item.id
                    ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <span className={`flex-shrink-0 ${
                  activeItem === item.id ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'
                }`}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Secondary Navigation */}
      <div className="py-4 border-t border-neutral-200">
        <div className="px-3 mb-4">
          <h3 className={`text-xs font-semibold text-neutral-500 uppercase tracking-wider ${
            collapsed ? 'text-center' : ''
          }`}>
            {collapsed ? 'S' : 'Secondary'}
          </h3>
        </div>
        
        <ul className="space-y-1 px-2">
          {secondaryItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onItemClick?.(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg
                  transition-all duration-250 group
                  ${activeItem === item.id
                    ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <span className={`flex-shrink-0 ${
                  activeItem === item.id ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'
                }`}>
                  {item.icon}
                </span>
                
                {!collapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
