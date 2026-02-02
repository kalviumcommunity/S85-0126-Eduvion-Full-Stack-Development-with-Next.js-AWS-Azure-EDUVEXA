
 "use client";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUI } from "../../hooks/useUI";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const auth = useAuth();
  const ui = useUI();

  // Close profile card on outside click
  React.useEffect(() => {
    function handleProfileClick(e: MouseEvent) {
      const profileCard = document.getElementById("profile-card-dropdown");
      if (profileCard && !profileCard.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleProfileClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleProfileClick);
    };
  }, [showProfile]);

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
    <header className="w-full bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg sticky top-0 z-50">
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
          {/* Desktop Navigation & User Actions */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-purple-200 transition-colors font-medium">Home</Link>
            <Link href="/dashboard" className="text-white hover:text-purple-200 transition-colors font-medium">Dashboard</Link>
            <Link href="/student-progress" className="text-white hover:text-purple-200 transition-colors font-medium">Student Progress</Link>
            <Link href="/peer-feedback" className="text-white hover:text-purple-200 transition-colors font-medium">Peer Feedback</Link>
            <Link href="/users" className="text-white hover:text-purple-200 transition-colors font-medium">Team Members</Link>
            <Link href="/profile" className="text-white hover:text-purple-200 transition-colors font-medium">Profile</Link>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button (Right side) */}
            <button
              className="ml-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors"
              onClick={ui.toggleTheme}
              aria-label="Toggle theme"
            >
              {ui.theme === 'light' ? '🌙 Dark' : '🌞 Light'}
            </button>
            {/* Notification Bell */}
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
            {/* Auth State UI */}
            {auth.isLoggedIn ? (
              <>
                <div className="relative">
                  <button
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
                    onClick={() => setShowProfile((v) => !v)}
                    aria-label="Show profile"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.73 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {showProfile && (
                    <div id="profile-card-dropdown" className="absolute right-0 mt-2 w-80 bg-white text-gray-900 rounded-xl shadow-2xl border border-purple-100 z-50 animate-fade-in">
                      <div className="flex flex-col items-center p-6">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold mb-2">
                          {auth.user?.name ? auth.user.name[0].toUpperCase() : "U"}
                        </div>
                        <h2 className="text-xl font-bold text-indigo-700 mb-1">{auth.user?.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">Role: Developer</p>
                        <div className="grid grid-cols-2 gap-4 w-full mb-4">
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400">User ID</div>
                            <div className="font-semibold text-purple-700">#123456</div>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-3 text-center">
                            <div className="text-xs text-gray-400">Age</div>
                            <div className="font-semibold text-pink-700">25</div>
                          </div>
                        </div>
                        <button
                          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                          onClick={() => { auth.logout(); setShowProfile(false); }}
                        >Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors">Login</Link>
                <Link href="/signup" className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors">Signup</Link>
              </>
            )}
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
              <Link href="/" className="text-white hover:text-purple-200 transition-colors font-medium py-2">Home</Link>
              <Link href="/dashboard" className="text-white hover:text-purple-200 transition-colors font-medium py-2">Dashboard</Link>
              <Link href="/student-progress" className="text-white hover:text-purple-200 transition-colors font-medium py-2">Student Progress</Link>
              <Link href="/peer-feedback" className="text-white hover:text-purple-200 transition-colors font-medium py-2">Peer Feedback</Link>
              <Link href="/users" className="text-white hover:text-purple-200 transition-colors font-medium py-2">Team Members</Link>
              <Link href="/profile" className="text-white hover:text-purple-200 transition-colors font-medium py-2">Profile</Link>
              {/* Theme Toggle Button (Mobile) */}
              <button
                className="mt-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors"
                onClick={ui.toggleTheme}
                aria-label="Toggle theme"
              >
                {ui.theme === 'light' ? '🌞 Light' : '🌙 Dark'}
              </button>
              {/* Auth State UI (Mobile) */}
              {auth.isLoggedIn ? (
                <>
                  <span className="font-semibold">Hello, {auth.user?.name}</span>
                  <button
                    className="mt-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors"
                    onClick={auth.logout}
                  >Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="mt-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors">Login</Link>
                  <Link href="/signup" className="mt-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors">Signup</Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
