"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (credentials: { name: string; email: string; password: string; role?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state on mount (httpOnly cookies aren't in document.cookie, so always try /api/auth/me)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await fetchUserFromToken();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserFromToken = async () => {
    try {
      const response = await fetch('/api/auth/me', { credentials: 'include' });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        
        // Redirect to dashboard or intended page
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/dashboard';
        router.push(redirect);
        
        return { success: true };
      } else {
        const errorMessage = data.error || 'Login failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: { name: string; email: string; password: string; role?: string }) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsLoggedIn(true);
        
        // Redirect to dashboard
        router.push('/dashboard');
        
        return { success: true };
      } else {
        const errorMessage = data.error || 'Signup failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear local state
      setUser(null);
      setIsLoggedIn(false);
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setIsLoggedIn(false);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    await fetchUserFromToken();
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
          return true;
        }
      }

      // If refresh failed, clear auth state
      setUser(null);
      setIsLoggedIn(false);
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      setIsLoggedIn(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn, 
      user, 
      isLoading, 
      login,
      signup,
      logout,
      refreshUser,
      refreshToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Export backward compatibility hook
export const useAuth = useAuthContext;
