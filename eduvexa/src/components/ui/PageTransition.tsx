import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const
    }
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const
    }
  }
};

export default function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={typeof window !== 'undefined' ? window.location.pathname : 'default'}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
