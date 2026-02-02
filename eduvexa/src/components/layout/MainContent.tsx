"use client";

import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface MainContentProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function MainContent({ 
  children, 
  maxWidth = '2xl',
  padding = 'lg',
  className = ''
}: MainContentProps) {
  const { theme } = useTheme();

  // Max width classes
  const maxWidthClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  // Padding classes
  const paddingClasses = {
    sm: 'px-4 py-6',
    md: 'px-6 py-8',
    lg: 'px-8 py-10'
  };

  return (
    <div className={`
      ${maxWidthClasses[maxWidth]} 
      ${paddingClasses[padding]} 
      mx-auto
      ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}
      ${className}
    `}>
      {children}
    </div>
  );
}
