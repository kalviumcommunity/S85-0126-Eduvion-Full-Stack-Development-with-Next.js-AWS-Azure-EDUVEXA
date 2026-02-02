import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
}

export default function Card({ 
  title, 
  subtitle,
  children, 
  className = "", 
  padding = 'md',
  footer,
  headerAction,
  hover = true,
  variant = 'default'
}: CardProps) {
  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-soft',
    elevated: 'bg-white border border-gray-200 shadow-medium',
    bordered: 'bg-white border-2 border-gray-300'
  };

  const hoverStyles = hover ? 'hover:shadow-medium hover:-translate-y-0.5' : '';

  return (
    <div className={`
      rounded-xl transition-all duration-200
      ${variantStyles[variant]}
      ${hoverStyles}
      ${className}
    `}>
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-start mb-4">
          <div>
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
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className={paddingStyles[padding]}>
        {children}
      </div>

      {footer && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}
