import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const colorSchemes = {
  primary: {
    bg: 'bg-primary-600',
    text: 'text-primary-600',
    lightBg: 'bg-primary-50',
    lightText: 'text-primary-700',
    trendBg: 'bg-primary-100',
    trendText: 'text-primary-700',
  },
  secondary: {
    bg: 'bg-neutral-600',
    text: 'text-neutral-600',
    lightBg: 'bg-neutral-50',
    lightText: 'text-neutral-700',
    trendBg: 'bg-neutral-100',
    trendText: 'text-neutral-700',
  },
  success: {
    bg: 'bg-success-600',
    text: 'text-success-600',
    lightBg: 'bg-success-50',
    lightText: 'text-success-700',
    trendBg: 'bg-success-100',
    trendText: 'text-success-700',
  },
  warning: {
    bg: 'bg-warning-600',
    text: 'text-warning-600',
    lightBg: 'bg-warning-50',
    lightText: 'text-warning-700',
    trendBg: 'bg-warning-100',
    trendText: 'text-warning-700',
  },
  error: {
    bg: 'bg-error-600',
    text: 'text-error-600',
    lightBg: 'bg-error-50',
    lightText: 'text-error-700',
    trendBg: 'bg-error-100',
    trendText: 'text-error-700',
  },
};

const sizeStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const iconSizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  size = 'md',
  loading = false,
}: StatCardProps) {
  const colorScheme = colorSchemes[color] || colorSchemes.primary;
  const sizeStyle = sizeStyles[size];
  const iconSize = iconSizes[size];

  if (loading) {
    return (
      <div className={`${sizeStyle} bg-surface-0 border border-neutral-200 rounded-xl shadow-sm animate-pulse`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`${iconSize} bg-neutral-200 rounded-lg`}></div>
          <div className="w-16 h-6 bg-neutral-200 rounded-lg"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-neutral-200 rounded-lg w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded-lg w-1/2"></div>
        </div>
      </div>
    );
  }

  const TrendIcon = trend?.isPositive ? TrendingUp : trend?.isPositive === false ? TrendingDown : Minus;

  return (
    <motion.div
      className={`
        ${sizeStyle} 
        bg-surface-0 
        border border-neutral-200 
        rounded-xl 
        shadow-sm 
        hover:shadow-md 
        transition-all 
        duration-200
        group
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`
          ${iconSize} 
          ${colorScheme?.bg || 'bg-primary-600'} 
          rounded-lg 
          flex 
          items-center 
          justify-center 
          shadow-sm
          group-hover:scale-105
          transition-transform
          duration-200
        `}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className={`
            flex 
            items-center 
            gap-1 
            px-2 
            py-1 
            rounded-lg 
            text-sm 
            font-semibold
            ${colorScheme?.trendBg || 'bg-primary-100'} 
            ${colorScheme?.trendText || 'text-primary-700'}
          `}>
            <TrendIcon className="w-4 h-4" />
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-600">
          {title}
        </h3>
        <p className="text-2xl font-bold text-neutral-900">
          {value}
        </p>
      </div>
    </motion.div>
  );
}
