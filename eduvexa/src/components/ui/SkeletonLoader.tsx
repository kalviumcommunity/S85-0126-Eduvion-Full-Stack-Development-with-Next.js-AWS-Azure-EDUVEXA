"use client";

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export function SkeletonLoader({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  animate = true,
}: SkeletonLoaderProps) {
  const baseClasses = `
    ${animate ? 'animate-pulse' : ''}
    ${variant === 'circular' ? 'rounded-full' : 
      variant === 'rounded' ? 'rounded-lg' : 'rounded'}
    ${className}
  `;

  const skeletonStyle = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '2rem'),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={baseClasses}
            style={{
              ...skeletonStyle,
              width: index === lines - 1 ? '70%' : '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      style={skeletonStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}

// Predefined skeleton components
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <SkeletonLoader variant="circular" width={48} height={48} className="mb-4" />
      <SkeletonLoader variant="text" height={20} className="mb-2" />
      <SkeletonLoader variant="text" height={16} width="80%" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <SkeletonLoader variant="text" height={20} width="30%" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="border-b border-gray-100 dark:border-gray-800 p-4 last:border-b-0"
        >
          <div className="flex items-center gap-4">
            <SkeletonLoader variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <SkeletonLoader variant="text" height={16} width="40%" />
              <SkeletonLoader variant="text" height={14} width="60%" />
            </div>
            <SkeletonLoader variant="text" height={16} width={20} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <SkeletonLoader variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <SkeletonLoader variant="text" height={16} width="70%" />
            <SkeletonLoader variant="text" height={14} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}
