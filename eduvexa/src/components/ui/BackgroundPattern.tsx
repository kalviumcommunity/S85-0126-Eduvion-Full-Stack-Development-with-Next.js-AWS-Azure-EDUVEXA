"use client";

import { useTheme } from '@/contexts/ThemeContext';

export function BackgroundPattern() {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Subtle gradient background */}
      <div className={`absolute inset-0 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-white to-purple-50' 
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900/20'
      }`} />
      
      {/* Animated dots pattern */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="2"
                cy="2"
                r="1"
                fill={theme === 'light' ? '#e5e7eb' : '#374151'}
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96">
        <div className={`
          absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-blue-400 to-purple-400' 
            : 'bg-gradient-to-br from-blue-600 to-purple-600'
          }
        `} />
      </div>
      
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <div className={`
          absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse
          animation-delay-2000
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-purple-400 to-pink-400' 
            : 'bg-gradient-to-br from-purple-600 to-pink-600'
          }
        `} />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
        <div className={`
          absolute inset-0 rounded-full blur-3xl opacity-20 animate-pulse
          animation-delay-4000
          ${theme === 'light' 
            ? 'bg-gradient-to-br from-cyan-400 to-blue-400' 
            : 'bg-gradient-to-br from-cyan-600 to-blue-600'
          }
        `} />
      </div>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
