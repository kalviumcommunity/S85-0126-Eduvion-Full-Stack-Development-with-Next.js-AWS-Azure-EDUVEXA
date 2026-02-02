import React from 'react';

interface ProfessionalBadgeProps {
  children?: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProfessionalBadge({
  children,
  label,
  variant = 'primary',
  size = 'md',
  className = '',
}: ProfessionalBadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
  };
  
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children ?? label}
    </span>
  );
}
