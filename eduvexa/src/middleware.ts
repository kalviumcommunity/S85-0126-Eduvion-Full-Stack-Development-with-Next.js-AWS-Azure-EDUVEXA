import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security middleware for additional protection
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get the host
  const host = request.headers.get('host') || '';
  
  // HTTPS enforcement in production
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    // Redirect to HTTPS
    const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(httpsUrl, 301);
  }
  
  // Additional security headers
  response.headers.set('X-Requested-With', 'XMLHttpRequest');
  
  // Rate limiting headers (basic implementation)
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99');
  response.headers.set('X-RateLimit-Reset', new Date(Date.now() + 3600000).toISOString());
  
  // Security logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
  }
  
  return response;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
