'use client';

import { useState } from 'react';
import { CardSkeleton, TableSkeleton, DashboardSkeleton } from '../../components/ui/Skeleton';
import { NetworkErrorFallback } from '../../components/ui/ErrorBoundary';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function DemoPage() {
  const [loadingState, setLoadingState] = useState<'none' | 'skeleton' | 'table' | 'dashboard'>('none');
  const [errorState, setErrorState] = useState<Error | null>(null);
  const [data, setData] = useState<any[]>([]);

  const simulateLoading = async (type: 'skeleton' | 'table' | 'dashboard') => {
    setLoadingState(type);
    setErrorState(null);
    setData([]);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate success
    if (type === 'table') {
      setData([
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Active' },
      ]);
    }
    
    setLoadingState('none');
  };

  const simulateError = (errorType: 'network' | 'runtime' | 'validation') => {
    setErrorState(
      errorType === 'network' 
        ? new Error('Failed to fetch data. Please check your internet connection.')
        : errorType === 'runtime'
        ? new Error('Unexpected runtime error occurred while processing request.')
        : new Error('Validation failed: Required fields are missing.')
    );
    setLoadingState('none');
    setData([]);
  };

  const reset = () => {
    setLoadingState('none');
    setErrorState(null);
    setData([]);
  };

  if (errorState) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Error & Loading States Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Demonstrating different error and loading scenarios
            </p>
          </div>
          
          <NetworkErrorFallback error={errorState} resetError={reset} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Error & Loading States Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test different loading skeletons and error scenarios
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Controls
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loading Tests */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Loading States
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={() => simulateLoading('skeleton')}
                  disabled={loadingState !== 'none'}
                  variant="outline"
                  size="md"
                  label="Card Skeleton (3s)"
                />
                <Button
                  onClick={() => simulateLoading('table')}
                  disabled={loadingState !== 'none'}
                  variant="outline"
                  size="md"
                  label="Table Skeleton (3s)"
                />
                <Button
                  onClick={() => simulateLoading('dashboard')}
                  disabled={loadingState !== 'none'}
                  variant="outline"
                  size="md"
                  label="Dashboard Skeleton (3s)"
                />
              </div>
            </div>

            {/* Error Tests */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Error States
              </h3>
              <div className="space-y-2">
                <Button
                  onClick={() => simulateError('network')}
                  disabled={loadingState !== 'none'}
                  variant="outline"
                  size="md"
                  label="Network Error"
                />
                <Button
                  onClick={() => simulateError('runtime')}
                  disabled={loadingState !== 'none'}
                  variant="outline"
                  size="md"
                  label="Runtime Error"
                />
                <Button
                  onClick={() => simulateError('validation')}
                  disabled={loadingState !== 'none'}
                  variant="outline"
                  size="md"
                  label="Validation Error"
                />
              </div>
            </div>
          </div>

          {(loadingState !== 'none' || data.length > 0) && (
            <div className="mt-6">
              <Button
                onClick={reset}
                variant="primary"
                size="md"
                label="Reset Demo"
              />
            </div>
          )}
        </Card>

        {/* Demo Content */}
        {loadingState === 'skeleton' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Card Skeleton Loading
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        )}

        {loadingState === 'table' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Table Skeleton Loading
            </h2>
            <TableSkeleton rows={5} />
          </div>
        )}

        {loadingState === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dashboard Skeleton Loading
            </h2>
            <DashboardSkeleton />
          </div>
        )}

        {/* Success State (for table demo) */}
        {data.length > 0 && loadingState === 'none' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Successfully Loaded Data
            </h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {data.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Instructions */}
        {loadingState === 'none' && data.length === 0 && !errorState && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              How to Test
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Loading States:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click any loading button to see skeleton animations</li>
                  <li>Skeletons show the structure of upcoming content</li>
                  <li>Loading lasts 3 seconds to simulate network delay</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Error States:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click error buttons to see different error scenarios</li>
                  <li>Each error type has appropriate messaging and recovery options</li>
                  <li>Use the "Try Again" button to recover from errors</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Browser Testing:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Use browser dev tools to throttle network speed</li>
                  <li>Disable network to test offline scenarios</li>
                  <li>Navigate away and back to test loading states</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
