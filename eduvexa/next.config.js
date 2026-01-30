/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable HTTPS in development (for testing)
  experimental: {
    forceSwcTransforms: true,
  },
  
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // HSTS (HTTP Strict Transport Security)
          // Forces browsers to always use HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          
          // Content Security Policy (CSP)
          // Prevents XSS by restricting content sources
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.googletagmanager.com;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
              "img-src 'self' data: https:;",
              "font-src 'self' https://fonts.gstatic.com;",
              "connect-src 'self' https://api.github.com https://www.googleapis.com;",
              "frame-src 'self';",
              "object-src 'none';",
              "base-uri 'self';",
              "form-action 'self';",
              "frame-ancestors 'none';",
              "upgrade-insecure-requests;",
            ].join(' '),
          },
          
          // X-Frame-Options
          // Prevents clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          
          // X-Content-Type-Options
          // Prevents MIME-type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          
          // Referrer Policy
          // Controls how much referrer information is sent
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          
          // Permissions Policy
          // Controls browser feature access
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
            ].join(', '),
          },
          
          // X-XSS-Protection
          // Legacy XSS protection (modern browsers use CSP)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          
          // Content-Type
          // Ensure proper content type handling
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
        ],
      },
      
      // API-specific headers
      {
        source: '/api/(.*)',
        headers: [
          // CORS headers for API routes
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' 
              ? 'https://eduvexa.vercel.app' 
              : 'http://localhost:3000',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400', // 24 hours
          },
        ],
      },
    ];
  },
  
  // Environment-specific configurations
  ...(process.env.NODE_ENV === 'production' && {
    // Production-only security settings
    compress: true,
    poweredByHeader: false, // Remove X-Powered-By header
  }),
};

module.exports = nextConfig;
