import React from 'react';
import { motion, Variants } from 'framer-motion';
import Card from './Card';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  delay?: number;
  duration?: number;
  hover?: boolean;
}

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut" as const
    }
  }
};

export default function AnimatedCard({ 
  children, 
  className = "", 
  padding = 'md',
  delay = 0,
  duration = 0.5,
  hover = true
}: AnimatedCardProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      variants={cardVariants}
      transition={{ delay, duration }}
      className={className}
    >
      <Card padding={padding} hover={false}>
        {children}
      </Card>
    </motion.div>
  );
}
