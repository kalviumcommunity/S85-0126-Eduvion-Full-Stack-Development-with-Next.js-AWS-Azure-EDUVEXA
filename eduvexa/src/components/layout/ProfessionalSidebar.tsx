"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";

import {
  Home,
  LayoutDashboard,
  Users,
  User,
  Settings,
  MessageSquare,
  FolderKanban,
  LogIn,
  UserPlus,
  Sun,
  Moon,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
}

// Main navigation structure per user request
const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, href: "/" },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Real-time data",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    id: "profile",
    label: "Profile",
    description: "Edit functionality",
    icon: <User className="w-5 h-5" />,
    href: "/profile",
  },
  {
    id: "team",
    label: "Team Members",
    description: "Search & stats",
    icon: <Users className="w-5 h-5" />,
    href: "/users",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Task tracking",
    icon: <FolderKanban className="w-5 h-5" />,
    href: "/projects",
  },
  {
    id: "peer-feedback",
    label: "Peer Feedback",
    description: "Ratings system",
    icon: <MessageSquare className="w-5 h-5" />,
    href: "/peer-feedback",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Preferences",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
];

export default function ProfessionalSidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn } = useAuth();

  const navItems = isLoggedIn
    ? NAV_ITEMS
    : [
        { id: "home", label: "Home", icon: <Home className="w-5 h-5" />, href: "/", description: undefined },
      ];

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Section */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                group relative flex flex-col gap-0.5
                px-3 py-2.5 rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? theme === "light"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                      : "bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg shadow-indigo-500/20"
                    : theme === "light"
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-gray-700/50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110
                    ${
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400"
                    }
                  `}
                >
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold truncate block">
                    {item.label}
                  </span>
                  {item.description && (
                    <span
                      className={`text-xs truncate block ${
                        isActive ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {item.description}
                    </span>
                  )}
                </div>
              </div>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Dark Mode + Auth */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-4 space-y-3">
        {/* Dark Mode Toggle - Modern UI */}
        <button
          onClick={toggleTheme}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            font-medium text-sm transition-all duration-200
            hover:scale-[1.02] active:scale-[0.98]
            ${
              theme === "light"
                ? "bg-gray-200/80 hover:bg-gray-300/80 text-gray-800"
                : "bg-gray-700/80 hover:bg-gray-600/80 text-gray-200"
            }
          `}
          aria-label="Toggle dark mode"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </div>
          <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
        </button>

        {/* Auth Buttons - when NOT logged in */}
        {!isLoggedIn && (
          <div className="space-y-2">
            <Link
              href="/login"
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-3 rounded-xl
                font-semibold text-sm
                bg-gradient-to-r from-indigo-500 to-indigo-600 
                hover:from-indigo-600 hover:to-indigo-700 
                text-white shadow-md hover:shadow-lg
                transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
              "
            >
              <LogIn className="w-5 h-5" />
              Login
            </Link>
            <Link
              href="/signup"
              className="
                w-full flex items-center justify-center gap-2
                px-4 py-3 rounded-xl
                font-semibold text-sm
                bg-gradient-to-r from-emerald-500 to-green-600 
                hover:from-emerald-600 hover:to-green-700 
                text-white shadow-md hover:shadow-lg
                transition-all duration-200
                hover:scale-[1.02] active:scale-[0.98]
              "
            >
              <UserPlus className="w-5 h-5" />
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
