"use client";

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { 
  Search, 
  Bell, 
  Moon, 
  Sun,
  Menu,
  X
} from 'lucide-react';

interface ProfessionalLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function ProfessionalLayout({ children, sidebar }: ProfessionalLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const scrollDirection = useScrollDirection();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Navbar classes with hide/show behavior
  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-300 ease-in-out
    ${scrollDirection === 'down' ? '-translate-y-full' : 'translate-y-0'}
    ${theme === 'light' 
      ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm' 
      : 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg'
    }
  `;

  // Sidebar with fixed width (200px expanded, 64px collapsed)
  const sidebarClasses = `
    fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out
    ${isSidebarCollapsed ? 'w-16' : 'w-52'}
    ${theme === 'light' 
      ? 'bg-white border-r border-gray-200/50' 
      : 'bg-gray-900 border-r border-gray-800/50'
    }
  `;

  // Main content with proper flex layout
  const mainClasses = `
    flex-1 transition-all duration-300 ease-in-out
    ${isSidebarCollapsed ? 'ml-16' : 'ml-52'}
    ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}
  `;

  return (
    <div className={`min-h-screen flex ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      {/* Sidebar */}
      {sidebar && (
        <aside className={sidebarClasses}>
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                {!isSidebarCollapsed && (
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">EDUVEXA</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Tracker</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Content */}
            <nav className="flex-1 p-4">
              {sidebar}
            </nav>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <nav className={navbarClasses}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                      theme === 'light'
                        ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                        : 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                    } focus:outline-none transition-colors`}
                  />
                </div>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={mainClasses}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
