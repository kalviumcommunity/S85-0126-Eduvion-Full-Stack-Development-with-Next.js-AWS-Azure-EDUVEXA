import React from 'react';

interface CleanCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  variant?: 'default' | 'gradient' | 'bordered' | 'glass' | 'premium';
}

export default function CleanCard({
  children,
  title,
  className = '',
  padding = 'md',
  hover = true,
  variant = 'default',
}: CleanCardProps) {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl transition-all duration-200';
  
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-1' : '';

  const variantStyles: Record<NonNullable<CleanCardProps['variant']>, string> = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    gradient: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
    glass: 'bg-white/85 dark:bg-gray-800/85 backdrop-blur-md border border-gray-200/70 dark:border-gray-700/70 shadow-sm',
    premium: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
  };

  return (
    <div className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${variantStyles[variant]} ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      {children}
    </div>
  );
}
