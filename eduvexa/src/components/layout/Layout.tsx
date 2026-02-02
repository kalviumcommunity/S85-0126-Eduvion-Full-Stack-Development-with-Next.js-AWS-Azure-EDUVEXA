'use client';

import { useState } from 'react';
import Navbar from './Navbar';
import SidebarNav from './SidebarNav';

interface LayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export default function Layout({ 
  children, 
  user, 
  sidebarCollapsed = false,
  onSidebarToggle 
}: LayoutProps) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(!sidebarCollapsed);

  const handleNavClick = (item: string) => {
    setActiveNav(item);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
    onSidebarToggle?.();
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Navbar */}
      <Navbar 
        user={user}
        onMenuToggle={handleSidebarToggle}
        notifications={3}
      />

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'w-64' : 'w-16'}
          bg-surface-0 border-r border-neutral-200 shadow-sm
          transition-all duration-300 ease-in-out
          fixed lg:relative h-screen z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <SidebarNav 
            activeItem={activeNav}
            onItemClick={handleNavClick}
            collapsed={!sidebarOpen}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-neutral-900/50 z-30 lg:hidden"
            onClick={handleSidebarToggle}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
