"use client";

import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const { theme } = useTheme();

  const linkClasses = `
    flex items-center gap-2 text-sm transition-colors
    ${theme === 'light' 
      ? 'text-gray-600 hover:text-gray-900' 
      : 'text-gray-400 hover:text-gray-100'
    }
  `;

  const currentClasses = `
    flex items-center gap-2 text-sm font-medium
    ${theme === 'light' 
      ? 'text-gray-900' 
      : 'text-gray-100'
    }
  `;

  return (
    <nav className={`flex items-center space-x-2 ${className}`}>
      <a href="/" className={linkClasses}>
        <Home className="w-4 h-4" />
      </a>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className={`w-4 h-4 ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          
          {item.href ? (
            <a href={item.href} className={linkClasses}>
              {item.icon}
              <span>{item.label}</span>
            </a>
          ) : (
            <div className={currentClasses}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
