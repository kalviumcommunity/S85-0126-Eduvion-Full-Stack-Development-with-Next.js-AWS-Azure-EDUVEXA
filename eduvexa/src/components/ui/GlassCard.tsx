import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong' | 'premium';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shadow?: 'glass' | 'glass-lg' | 'premium' | 'premium-lg' | 'premium-xl';
}

const glassVariants = {
  default: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  subtle: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  strong: {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  premium: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
};

const hoverVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const paddingStyles = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const roundedStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-[2.5rem]',
};

export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  hover = true,
  padding = 'md',
  rounded = 'lg',
  shadow = 'glass',
}: GlassCardProps) {
  const MotionComponent = motion.div;
  
  return (
    <MotionComponent
      className={`
        ${paddingStyles[padding]}
        ${roundedStyles[rounded]}
        shadow-${shadow}
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        ...glassVariants[variant],
        WebkitBackdropFilter: glassVariants[variant].backdropFilter,
      }}
      whileHover={hover ? hoverVariants.hover : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </MotionComponent>
  );
}
