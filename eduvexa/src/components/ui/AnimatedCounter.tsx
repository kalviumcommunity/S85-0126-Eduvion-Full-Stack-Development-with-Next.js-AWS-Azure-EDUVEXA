"use client";

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  prefix = '', 
  suffix = '',
  className = '' 
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(0);

  useEffect(() => {
    if (value === previousValue.current) return;
    
    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = previousValue.current;
    const endValue = value;
    const difference = endValue - startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = Math.floor(startValue + difference * easeOut);
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        previousValue.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={`tabular-nums ${isAnimating ? 'transition-all duration-100' : ''} ${className}`}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
