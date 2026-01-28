"use client";
import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../context/AuthContext';
import Loader from '../ui/Loader';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not logged in, redirect to login
    if (!isLoading && !isLoggedIn) {
      console.log('User not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [isLoggedIn, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader text="Verifying authentication..." size="lg" />
      </div>
    );
  }

  // If not logged in, show nothing (will redirect)
  if (!isLoggedIn) {
    return fallback || null;
  }

  // If logged in, show children
  return <>{children}</>;
}

/**
 * Higher-order component for protecting routes
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Hook to check if current route is protected
 */
export function useProtectedRoute() {
  const { isLoggedIn, isLoading, user } = useAuthContext();
  const router = useRouter();

  const requireAuth = () => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
      return false;
    }
    return isLoggedIn;
  };

  return {
    isProtected: isLoggedIn,
    isLoading,
    user,
    requireAuth,
  };
}
