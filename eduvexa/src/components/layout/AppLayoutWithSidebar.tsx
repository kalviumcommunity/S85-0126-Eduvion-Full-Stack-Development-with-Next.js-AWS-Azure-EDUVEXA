"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import ProfessionalSidebar from "./ProfessionalSidebar";
import { Menu, X, Sun, Moon, LogOut, User } from "lucide-react";

interface AppLayoutWithSidebarProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppLayoutWithSidebar({ children, title }: AppLayoutWithSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isLoggedIn, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${theme}`}>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* App Logo/Title */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  EDUVEXA
                </h1>
                {title && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                )}
              </div>
            </Link>
          </div>

          {/* Right Side: Theme Toggle + Auth */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-300" />
              )}
            </button>

            {/* Auth: Login/Signup or User + Logout */}
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors font-medium"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container - full width, no right gap */}
      <div className="flex pt-16 min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed left-0 top-16 bottom-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex-shrink-0
            ${isSidebarOpen ? "w-64" : "w-0 overflow-hidden"}
          `}
        >
          {isSidebarOpen && (
            <div className="h-full overflow-y-auto py-2">
              <ProfessionalSidebar />
            </div>
          )}
        </aside>

        {/* Main Content Area - fills remaining space, no right gap */}
        <main
          className={`
            flex-1 min-w-0 w-full max-w-full transition-all duration-300 ease-in-out overflow-x-hidden
            ${isSidebarOpen ? "ml-64" : "ml-0"}
            min-h-[calc(100vh-4rem)]
            bg-gray-50 dark:bg-gray-900
          `}
        >
          <div
            className={`p-6 w-full max-w-full box-border ${isAuthPage ? "flex justify-center items-start min-h-full" : ""}`}
          >
            {children}
          </div>
        </main>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 sm:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
