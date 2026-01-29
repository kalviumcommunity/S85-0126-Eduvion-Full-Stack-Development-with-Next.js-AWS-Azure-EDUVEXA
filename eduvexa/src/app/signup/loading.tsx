import { FormSkeleton } from '../../components/ui/Skeleton';

export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo Skeleton */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 animate-pulse"></div>
          
          {/* Title Skeleton */}
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto mb-2 animate-pulse"></div>
          
          {/* Subtitle Skeleton */}
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto mb-2 animate-pulse"></div>
          
          {/* Description Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto animate-pulse"></div>
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <FormSkeleton />
          
          {/* Footer Links Skeleton */}
          <div className="mt-8 text-center space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mx-auto animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* Terms Skeleton */}
        <div className="mt-8 text-center">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
