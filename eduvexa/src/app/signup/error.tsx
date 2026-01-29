'use client';

import { PageErrorFallback } from '../../components/ui/ErrorBoundary';

export default function SignupError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">EDUVEXA</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Work Tracker System</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <PageErrorFallback error={error} resetError={reset} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <a 
                href="/login" 
                className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                Sign in instead
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
