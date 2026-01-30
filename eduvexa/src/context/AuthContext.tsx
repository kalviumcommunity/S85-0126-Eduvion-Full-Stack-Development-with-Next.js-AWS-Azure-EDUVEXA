"use client";
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { JWTManager } from '../utils/jwt';
import { api } from '../utils/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  signup: (credentials: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = JWTManager.getAccessToken();
        
        if (token && !JWTManager.isAccessTokenExpired()) {
          const userPayload = JWTManager.getUserFromToken();
          if (userPayload) {
            setUser({
              id: userPayload.userId,
              name: userPayload.name,
              email: userPayload.email,
            });
            setIsLoggedIn(true);
            console.log('User authenticated from existing token');
          }
        } else if (JWTManager.isAccessTokenExpired() && JWTManager.getRefreshToken()) {
          // Try to refresh the token
          refreshAccessToken();
        } else {
          console.log('No valid tokens found');
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        JWTManager.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up token refresh timer
    JWTManager.initializeTokenRefresh();
  }, []);

  /**
   * Login with credentials
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await api.login(credentials);
      if (response.success && response.data) {
        const { user: userData, tokens } = response.data;
        JWTManager.setTokens(tokens);
        setUser(userData);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        const errorMessage = response.error || 'Login failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: { name: string; email: string; password: string }) => {
    try {
      setIsLoading(true);
      const response = await api.signup(credentials);
      if (response.success) {
        return { success: true };
      } else {
        const errorMessage = response.error || 'Signup failed';
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API
      await api.logout();
      
      // Clear local state
      setUser(null);
      setIsLoggedIn(false);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh access token
   */
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      console.log('Refreshing access token...');
      const newToken = await JWTManager.refreshAccessToken();
      
      if (newToken) {
        const userPayload = JWTManager.getUserFromToken();
        if (userPayload) {
          setUser({
            id: userPayload.userId,
            name: userPayload.name,
            email: userPayload.email,
          });
          setIsLoggedIn(true);
          console.log('Token refresh successful');
          return true;
        }
      }
      
      // If refresh failed, clear auth state
      setUser(null);
      setIsLoggedIn(false);
      console.log('Token refresh failed, user logged out');
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      setIsLoggedIn(false);
      return false;
    }
  };

  const refreshToken = refreshAccessToken;

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      isLoading, 
      login, 
      signup,
      logout, 
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
