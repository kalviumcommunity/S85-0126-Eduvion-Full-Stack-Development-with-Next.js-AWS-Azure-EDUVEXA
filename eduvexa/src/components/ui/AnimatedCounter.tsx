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
    const startValue = previousValue.current;

    // Animate from start to end value
    const steps = 60;
    const increment = (value - startValue) / steps;
    let currentValue = startValue;
    let step = 0;

    const animationInterval = setInterval(() => {
      step++;
      currentValue = startValue + (increment * step);
      setDisplayValue(Math.floor(currentValue));
      
      if (step >= steps) {
        clearInterval(animationInterval);
        setDisplayValue(value);
        setIsAnimating(false);
        previousValue.current = value;
      }
    }, duration / steps);

    return () => {
      clearInterval(animationInterval);
      setIsAnimating(false);
    };
  }, [value, isAnimating, duration]);

  return (
    <span className={`tabular-nums ${isAnimating ? 'transition-all duration-100' : ''} ${className}`}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}
