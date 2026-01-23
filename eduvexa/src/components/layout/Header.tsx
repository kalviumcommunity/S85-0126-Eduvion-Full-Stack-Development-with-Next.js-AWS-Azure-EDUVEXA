
 "use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Close notifications dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const notif = document.getElementById("notification-dropdown");
      if (notif && !notif.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [showNotifications]);

  return (
    <header className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xl">EDUVEXA</h1>
              <p className="text-xs text-purple-100">Work Tracker</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-200 transition-colors font-medium">
              Home
            </Link>
            <Link href="/dashboard" className="text-white hover:text-purple-200 transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/users" className="text-white hover:text-purple-200 transition-colors font-medium">
              Team Members
            </Link>
            <Link href="/profile" className="text-white hover:text-purple-200 transition-colors font-medium">
              Profile
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setShowNotifications((v) => !v)}
                aria-label="Show notifications"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div
                  id="notification-dropdown"
                  className="absolute right-0 mt-2 w-80 bg-white text-gray-900 rounded-xl shadow-lg border border-purple-100 z-50 animate-fade-in"
                >
                  <div className="p-4 border-b border-gray-100 font-semibold text-purple-700">Notifications</div>
                  <ul className="divide-y divide-gray-100">
                    <li className="p-4 hover:bg-purple-50 transition">
                      <span className="font-bold text-cyan-600">New task assigned:</span> "Prepare weekly report" by Admin.
                      <span className="block text-xs text-gray-400 mt-1">2 min ago</span>
                    </li>
                    <li className="p-4 hover:bg-purple-50 transition">
                      <span className="font-bold text-pink-600">Team meeting scheduled:</span> Friday, 10:00 AM.
                      <span className="block text-xs text-gray-400 mt-1">10 min ago</span>
                    </li>
                    <li className="p-4 hover:bg-purple-50 transition">
                      <span className="font-bold text-green-600">Profile updated:</span> Your bio was changed successfully.
                      <span className="block text-xs text-gray-400 mt-1">1 hour ago</span>
                    </li>
                  </ul>
                  <div className="p-3 text-center text-xs text-gray-500">No more notifications</div>
                </div>
              )}
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
              <span className="font-semibold">SS</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-white hover:text-purple-200 transition-colors font-medium py-2">
                Home
              </Link>
              <Link href="/dashboard" className="text-white hover:text-purple-200 transition-colors font-medium py-2">
                Dashboard
              </Link>
              <Link href="/users" className="text-white hover:text-purple-200 transition-colors font-medium py-2">
                Team Members
              </Link>
              <Link href="/profile" className="text-white hover:text-purple-200 transition-colors font-medium py-2">
                Profile
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
