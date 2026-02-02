import React from 'react';

interface ProfessionalCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  variant?: 'default' | 'bordered' | 'gradient' | 'elevated';
}

export default function ProfessionalCard({
  children,
  title,
  subtitle,
  className = '',
  padding = 'md',
  hover = true,
  variant = 'default',
}: ProfessionalCardProps) {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl transition-all duration-200';
  
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverStyles = hover ? 'hover:shadow-md hover:-translate-y-1' : '';
  
  const variantStyles = {
    default: 'border border-gray-200 dark:border-gray-700 shadow-sm',
    bordered: 'border border-gray-200 dark:border-gray-700',
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 border-0 shadow-lg',
    elevated: 'shadow-lg border-0',
  };

  return (
    <div className={`${baseStyles} ${paddingStyles[padding]} ${hoverStyles} ${variantStyles[variant]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
