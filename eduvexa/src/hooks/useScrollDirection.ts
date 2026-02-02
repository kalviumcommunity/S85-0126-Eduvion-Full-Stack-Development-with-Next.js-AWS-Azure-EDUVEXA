"use client";

import { useState, useEffect, useRef } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    lastScrollY.current = window.scrollY;
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set a timeout to avoid rapid direction changes
      timeoutRef.current = setTimeout(() => {
        if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
        lastScrollY.current = currentScrollY;
      }, 10); // Small delay to batch scroll events
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMounted]);

  return scrollDirection;
}
