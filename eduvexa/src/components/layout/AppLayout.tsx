"use client";

import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function AppLayout({ children, sidebar }: AppLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const scrollDirection = useScrollDirection();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  /* ================================
      NAVBAR
  ================================ */

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50
    h-14
    transition-transform duration-300 ease-in-out
    ${scrollDirection === "down" ? "-translate-y-full" : "translate-y-0"}
    will-change-transform
    ${
      theme === "light"
        ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
        : "bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-lg"
    }
  `;

  /* ================================
      SIDEBAR
  ================================ */

  const sidebarClasses = `
    fixed left-0 top-0 h-full z-40
    transition-all duration-300 ease-in-out
    ${isSidebarCollapsed ? "w-16" : "w-56"}
    ${
      theme === "light"
        ? "bg-white border-r border-gray-200/50"
        : "bg-gray-900 border-r border-gray-800/50"
    }
  `;

  /* ================================
      MAIN CONTENT  (FIXED GAP)
  ================================ */

  const mainClasses = `
    transition-all duration-300 ease-in-out
    ${isSidebarCollapsed ? "ml-16" : "ml-56"}
    ${theme === "light" ? "bg-gray-50" : "bg-gray-900"}
    ${scrollDirection === "down" ? "pt-0" : "pt-14"}
  `;

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-gray-900"}`}>

      {/* ================= Sidebar ================= */}
      {sidebar && (
        <aside className={sidebarClasses}>
          <div className="flex flex-col h-full">

            {/* Logo - Simplified since brand is now in navbar */}
            <div className="flex items-center justify-start p-4 border-b border-gray-200/50 dark:border-gray-800/50">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4">
              {sidebar}
            </nav>
          </div>
        </aside>
      )}

      {/* ================= Navbar ================= */}
      <nav className={navbarClasses}>
<div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">

            {/* Left Side - Brand */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>

              {/* Brand - Always visible in navbar */}
<div className="flex items-center gap-3 animate-fade-in mr-auto -ml-6 sm:-ml-8 lg:-ml-25">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    EDUVEXA
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tracker
                  </p>
                </div>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-lg mx-4 md:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  placeholder="Search..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border
                  ${
                    theme === "light"
                      ? "bg-white border-gray-300"
                      : "bg-gray-800 border-gray-600 text-white"
                  }`}
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === "light" ? <Moon /> : <Sun />}
              </button>

              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Bell />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="flex items-center gap-3 animate-fade-in-delay">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">JD</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </nav>

      {/* ================= Main ================= */}
      <main className={mainClasses}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* ================= Mobile Overlay ================= */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

    </div>
  );
}
