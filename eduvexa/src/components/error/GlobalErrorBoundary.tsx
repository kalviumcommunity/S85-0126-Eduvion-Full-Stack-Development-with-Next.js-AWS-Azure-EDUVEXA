'use client';

import ErrorBoundary, { withErrorBoundary } from '../ui/ErrorBoundary';
import { useEffect } from 'react';

// Type declaration for gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, eventParameters: {
      description?: string;
      fatal?: boolean;
    }) => void;
  }
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

function GlobalErrorBoundaryComponent({ children }: GlobalErrorBoundaryProps) {
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // In production, you might want to send this to an error reporting service
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: `Unhandled promise rejection: ${event.reason}`,
          fatal: false,
        });
      }
    };

    // Global error handler for runtime errors
    const handleError = (event: ErrorEvent) => {
      console.error('Runtime error:', event.error);
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: `Runtime error: ${event.error?.message || event.message}`,
          fatal: false,
        });
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

export default GlobalErrorBoundaryComponent;

// HOC for wrapping components with global error boundary
export function withGlobalErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
) {
  return withErrorBoundary(Component);
}
