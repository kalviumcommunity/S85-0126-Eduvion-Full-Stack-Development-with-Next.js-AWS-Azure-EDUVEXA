'use client';

import { useState } from 'react';
import { runSecurityTest, generateRecommendations, SecurityReport } from '../../utils/security-test';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function SecurityTestPage() {
  const [report, setReport] = useState<SecurityReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/auth/login`;
      
      const securityReport = await runSecurityTest(baseUrl, apiUrl);
      setReport(securityReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Security test failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return 'text-green-600 bg-green-100';
      case 'fail': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail' | 'warning') => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warning': return '⚠️';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-600';
      case 'B': return 'text-blue-600';
      case 'C': return 'text-yellow-600';
      case 'D':
      case 'F': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Security Headers & HTTPS Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test your application's security configuration including HSTS, CSP, CORS, and HTTPS enforcement.
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Security Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Click below to run a comprehensive security test on your application
              </p>
            </div>
            <Button
              onClick={runTest}
              disabled={loading}
              variant="primary"
              size="md"
              label={loading ? "Running Tests..." : "Run Security Test"}
            />
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
            <div className="flex items-center space-x-3">
              <span className="text-red-600 text-xl">❌</span>
              <div>
                <h3 className="text-red-800 dark:text-red-200 font-semibold">Test Failed</h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="mb-8">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Running security tests...</span>
            </div>
          </Card>
        )}

        {/* Results */}
        {report && !loading && (
          <div className="space-y-6">
            {/* Score Overview */}
            <Card>
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${getGradeColor(report.grade)}`}>
                  {report.grade}
                </div>
                <div className="text-2xl text-gray-600 dark:text-gray-400 mb-2">
                  Security Score: {report.score}/100
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500">
                  Tested at {new Date(report.timestamp).toLocaleString()}
                </div>
              </div>
            </Card>

            {/* Test Results */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Detailed Results
              </h3>
              <div className="space-y-3">
                {report.results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)} border-opacity-20`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{getStatusIcon(result.status)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {result.test}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {result.message}
                        </p>
                        {result.recommendation && (
                          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2 italic">
                            💡 {result.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Security Recommendations
              </h3>
              <div className="space-y-2">
                {generateRecommendations(report).map((rec, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400 text-sm">
                    {rec}
                  </div>
                ))}
              </div>
            </Card>

            {/* Test Information */}
            <Card>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                What Was Tested
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">HTTPS & Transport</h4>
                  <ul className="space-y-1">
                    <li>• HTTPS enforcement</li>
                    <li>• HSTS configuration</li>
                    <li>• Certificate validation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Security Headers</h4>
                  <ul className="space-y-1">
                    <li>• Content Security Policy (CSP)</li>
                    <li>• X-Frame-Options</li>
                    <li>• X-Content-Type-Options</li>
                    <li>• Referrer Policy</li>
                    <li>• Permissions Policy</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">API Security</h4>
                  <ul className="space-y-1">
                    <li>• CORS configuration</li>
                    <li>• Allowed origins</li>
                    <li>• Method restrictions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Information Disclosure</h4>
                  <ul className="space-y-1">
                    <li>• Server header exposure</li>
                    <li>• X-Powered-By removal</li>
                    <li>• Error message leakage</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Manual Testing Instructions */}
        {!report && !loading && (
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Manual Testing Instructions
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Browser DevTools Testing</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open Chrome DevTools (F12)</li>
                  <li>Go to Network tab</li>
                  <li>Refresh the page</li>
                  <li>Click on any request</li>
                  <li>Check Response Headers section</li>
                  <li>Look for security headers like HSTS, CSP, etc.</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Online Security Scanners</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <a href="https://securityheaders.com" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">securityheaders.com</a></li>
                  <li>• <a href="https://observatory.mozilla.org" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Observatory</a></li>
                  <li>• <a href="https://ssllabs.com/ssltest/" className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">SSL Labs SSL Test</a></li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
