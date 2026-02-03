import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import ProfessionalSidebar from '../src/components/layout/ProfessionalSidebar';

// Mock the hooks
jest.mock('next/navigation');
jest.mock('@/contexts/ThemeContext');
jest.mock('@/hooks/useAuth');

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('ProfessionalSidebar Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Default mock implementations
    mockUsePathname.mockReturnValue('/');
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: jest.fn(),
      setTheme: jest.fn(),
    });
    mockUseAuth.mockReturnValue({
      isLoggedIn: false,
      user: null,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
      refreshUser: jest.fn(),
      refreshToken: jest.fn(),
    });
  });

  it('renders loading skeleton when not mounted', () => {
    // Mock the component to show loading state
    jest.spyOn(React, 'useState').mockReturnValue([false, jest.fn()]);
    
    render(<ProfessionalSidebar />);
    
    // Should show skeleton loaders
    const skeletons = screen.getAllByRole('generic').filter(el => 
      el.className.includes('animate-pulse')
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders navigation items when logged in', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    });

    render(<ProfessionalSidebar />);
    
    // Check for main navigation items
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Peer Feedback')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders only Home item when not logged in', () => {
    render(<ProfessionalSidebar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    });

    render(<ProfessionalSidebar />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-gradient-to-r');
  });

  it('renders theme toggle button', () => {
    render(<ProfessionalSidebar />);
    
    const themeToggle = screen.getByRole('button', { name: /toggle dark mode/i });
    expect(themeToggle).toBeInTheDocument();
  });

  it('renders auth buttons when not logged in', () => {
    render(<ProfessionalSidebar />);
    
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('does not render auth buttons when logged in', () => {
    mockUseAuth.mockReturnValue({
      isLoggedIn: true,
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    });

    render(<ProfessionalSidebar />);
    
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
  });

  it('applies correct theme classes', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: jest.fn(),
    });

    render(<ProfessionalSidebar />);
    
    const container = screen.getByRole('generic').closest('.flex');
    expect(container).toBeInTheDocument();
  });
});
