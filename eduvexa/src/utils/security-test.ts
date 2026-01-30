// Security testing utility for verifying headers and HTTPS enforcement

export interface SecurityTestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  recommendation?: string;
}

export interface SecurityReport {
  timestamp: string;
  url: string;
  results: SecurityTestResult[];
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

// Security headers to test
const SECURITY_HEADERS = {
  'Strict-Transport-Security': {
    required: true,
    test: (value?: string) => {
      if (!value) return { status: 'fail', message: 'HSTS header missing' };
      if (value.includes('max-age=63072000')) {
        return { status: 'pass', message: 'HSTS properly configured with 2-year max-age' };
      }
      return { status: 'warning', message: 'HSTS present but max-age less than 2 years' };
    }
  },
  'Content-Security-Policy': {
    required: true,
    test: (value?: string) => {
      if (!value) return { status: 'fail', message: 'CSP header missing' };
      if (value.includes("default-src 'self'")) {
        return { status: 'pass', message: 'CSP properly configured with default-src self' };
      }
      return { status: 'warning', message: 'CSP present but may be too permissive' };
    }
  },
  'X-Frame-Options': {
    required: true,
    test: (value?: string) => {
      if (!value) return { status: 'fail', message: 'X-Frame-Options header missing' };
      if (value === 'DENY') {
        return { status: 'pass', message: 'X-Frame-Options set to DENY' };
      }
      return { status: 'warning', message: 'X-Frame-Options not set to DENY' };
    }
  },
  'X-Content-Type-Options': {
    required: true,
    test: (value?: string) => {
      if (!value) return { status: 'fail', message: 'X-Content-Type-Options header missing' };
      if (value === 'nosniff') {
        return { status: 'pass', message: 'X-Content-Type-Options set to nosniff' };
      }
      return { status: 'warning', message: 'X-Content-Type-Options not set to nosniff' };
    }
  },
  'Referrer-Policy': {
    required: true,
    test: (value?: string) => {
      if (!value) return { status: 'fail', message: 'Referrer-Policy header missing' };
      if (value.includes('strict-origin')) {
        return { status: 'pass', message: 'Referrer-Policy properly configured' };
      }
      return { status: 'warning', message: 'Referrer-Policy may be too permissive' };
    }
  },
  'Permissions-Policy': {
    required: false,
    test: (value?: string) => {
      if (!value) return { status: 'warning', message: 'Permissions-Policy header missing' };
      return { status: 'pass', message: 'Permissions-Policy configured' };
    }
  }
};

// Test HTTPS enforcement
async function testHTTPS(url: string): Promise<SecurityTestResult> {
  try {
    const testUrl = url.startsWith('https') ? url : `https://${url.replace(/^https?:\/\//, '')}`;
    const response = await fetch(testUrl, { method: 'HEAD' });
    
    if (response.url.startsWith('https')) {
      return {
        test: 'HTTPS Enforcement',
        status: 'pass',
        message: 'HTTPS properly enforced'
      };
    } else {
      return {
        test: 'HTTPS Enforcement',
        status: 'fail',
        message: 'HTTP connection detected',
        recommendation: 'Configure HSTS and ensure HTTPS-only connections'
      };
    }
  } catch (error) {
    return {
      test: 'HTTPS Enforcement',
      status: 'warning',
      message: 'Unable to test HTTPS connection',
      recommendation: 'Verify HTTPS configuration manually'
    };
  }
}

// Test security headers
async function testSecurityHeaders(url: string): Promise<SecurityTestResult[]> {
  const results: SecurityTestResult[] = [];
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const headers = response.headers;
    
    for (const [headerName, config] of Object.entries(SECURITY_HEADERS)) {
      const headerValue = headers.get(headerName) || undefined;
      const result = config.test(headerValue);
      
      results.push({
        test: headerName,
        status: result.status as 'pass' | 'fail' | 'warning',
        message: result.message,
        recommendation: (result as any).recommendation
      });
    }
    
    // Test for server information disclosure
    const server = headers.get('server');
    if (server && !server.includes('vercel')) {
      results.push({
        test: 'Server Information Disclosure',
        status: 'warning',
        message: `Server header reveals: ${server}`,
        recommendation: 'Consider hiding server information'
      });
    } else {
      results.push({
        test: 'Server Information Disclosure',
        status: 'pass',
        message: 'Server header properly configured or hidden'
      });
    }
    
    // Test for powered-by header
    const poweredBy = headers.get('x-powered-by');
    if (poweredBy) {
      results.push({
        test: 'X-Powered-By Header',
        status: 'warning',
        message: `X-Powered-By header reveals: ${poweredBy}`,
        recommendation: 'Remove X-Powered-By header in production'
      });
    } else {
      results.push({
        test: 'X-Powered-By Header',
        status: 'pass',
        message: 'X-Powered-By header properly removed'
      });
    }
    
  } catch (error) {
    results.push({
      test: 'Security Headers Test',
      status: 'fail',
      message: 'Failed to fetch headers for testing',
      recommendation: 'Check network connectivity and URL accessibility'
    });
  }
  
  return results;
}

// Test CORS configuration
async function testCORS(apiUrl: string): Promise<SecurityTestResult> {
  try {
    const response = await fetch(apiUrl, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://eduvexa.vercel.app',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    const acao = response.headers.get('Access-Control-Allow-Origin');
    
    if (acao === 'https://eduvexa.vercel.app' || acao === 'http://localhost:3000') {
      return {
        test: 'CORS Configuration',
        status: 'pass',
        message: 'CORS properly configured with specific origins'
      };
    } else if (acao === '*') {
      return {
        test: 'CORS Configuration',
        status: 'warning',
        message: 'CORS allows all origins (*)',
        recommendation: 'Restrict CORS to specific origins in production'
      };
    } else {
      return {
        test: 'CORS Configuration',
        status: 'fail',
        message: 'CORS may not be properly configured',
        recommendation: 'Verify CORS headers in API routes'
      };
    }
  } catch (error) {
    return {
      test: 'CORS Configuration',
      status: 'warning',
      message: 'Unable to test CORS configuration',
      recommendation: 'Test CORS manually with browser dev tools'
    };
  }
}

// Calculate security score
function calculateScore(results: SecurityTestResult[]): { score: number; grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' } {
  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;
  const total = results.length;
  
  const score = Math.round((passCount / total) * 100);
  
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 95 && failCount === 0 && warningCount <= 1) grade = 'A+';
  else if (score >= 90 && failCount === 0) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  return { score, grade };
}

// Main security test function
export async function runSecurityTest(baseUrl: string, apiUrl?: string): Promise<SecurityReport> {
  const results: SecurityTestResult[] = [];
  
  // Test HTTPS
  results.push(await testHTTPS(baseUrl));
  
  // Test security headers
  const headerResults = await testSecurityHeaders(baseUrl);
  results.push(...headerResults);
  
  // Test CORS if API URL provided
  if (apiUrl) {
    results.push(await testCORS(apiUrl));
  }
  
  const { score, grade } = calculateScore(results);
  
  return {
    timestamp: new Date().toISOString(),
    url: baseUrl,
    results,
    score,
    grade
  };
}

// Generate security recommendations
export function generateRecommendations(report: SecurityReport): string[] {
  const recommendations: string[] = [];
  
  const failedTests = report.results.filter(r => r.status === 'fail');
  const warningTests = report.results.filter(r => r.status === 'warning');
  
  if (failedTests.length > 0) {
    recommendations.push(`Critical Issues (${failedTests.length}):`);
    failedTests.forEach(test => {
      if (test.recommendation) {
        recommendations.push(`  • ${test.recommendation}`);
      }
    });
  }
  
  if (warningTests.length > 0) {
    recommendations.push(`Improvements Needed (${warningTests.length}):`);
    warningTests.forEach(test => {
      if (test.recommendation) {
        recommendations.push(`  • ${test.recommendation}`);
      }
    });
  }
  
  if (report.grade === 'A+' || report.grade === 'A') {
    recommendations.push('Excellent security configuration! Consider:');
    recommendations.push('  • Regular security audits');
    recommendations.push('  • Monitoring for new vulnerabilities');
    recommendations.push('  • Keeping dependencies updated');
  }
  
  return recommendations;
}
