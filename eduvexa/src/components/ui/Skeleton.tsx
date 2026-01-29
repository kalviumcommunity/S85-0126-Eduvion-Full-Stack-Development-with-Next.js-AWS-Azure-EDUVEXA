import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number; // For text variant
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const style = {
    width: width || (variant === 'text' ? '100%' : '40px'),
    height: height || (variant === 'text' ? '1rem' : '40px'),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '70%' : '100%', // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

// Predefined skeleton components for common patterns
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="40%" />
          <Skeleton width="60%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton lines={3} />
      </div>
      <div className="flex justify-between">
        <Skeleton width={80} height={32} variant="rounded" />
        <Skeleton width={80} height={32} variant="rounded" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton width="30%" height={20} />
        <Skeleton height={48} variant="rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton width="25%" height={20} />
        <Skeleton height={48} variant="rounded" />
      </div>
      <div className="space-y-2">
        <Skeleton width="35%" height={20} />
        <Skeleton height={48} variant="rounded" />
      </div>
      <Skeleton width="100%" height={48} variant="rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton width="20%" height={20} />
          <Skeleton width="25%" height={20} />
          <Skeleton width="30%" height={20} />
          <Skeleton width="25%" height={20} />
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <Skeleton height={16} />
              <Skeleton height={16} />
              <Skeleton height={16} />
              <Skeleton height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={32} className="mt-2" />
          </div>
        ))}
      </div>
      
      {/* Chart Area */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Skeleton width="30%" height={20} />
        <div className="mt-4 h-64">
          <Skeleton height="100%" variant="rectangular" />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Skeleton width="40%" height={20} />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1">
                <Skeleton width="70%" height={16} />
                <Skeleton width="50%" height={12} className="mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <Skeleton variant="circular" width={96} height={96} />
          <div className="flex-1 space-y-3">
            <Skeleton width="30%" height={24} />
            <Skeleton width="50%" height={16} />
            <Skeleton width="40%" height={16} />
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <Skeleton width="20%" height={20} />
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton width="40%" height={16} />
              <Skeleton height={20} variant="rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton width="35%" height={16} />
              <Skeleton height={20} variant="rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton width="45%" height={16} />
              <Skeleton height={20} variant="rounded" />
            </div>
            <div className="space-y-2">
              <Skeleton width="30%" height={16} />
              <Skeleton height={20} variant="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
