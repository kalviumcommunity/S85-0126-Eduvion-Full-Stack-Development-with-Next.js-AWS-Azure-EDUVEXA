import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// Public routes that don't require authentication
const publicPaths = [
  { path: "/", exact: true },
  { path: "/login", exact: false },
  { path: "/signup", exact: false },
  { path: "/api/auth/login", exact: false },
  { path: "/api/auth/signup", exact: false },
  { path: "/api/auth/logout", exact: false },
  { path: "/api/auth/me", exact: false },
];

function isPublicRoute(pathname: string): boolean {
  return publicPaths.some(({ path, exact }) =>
    exact ? pathname === path : pathname === path || pathname.startsWith(path + "/")
  );
}

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/team",
  "/projects",
  "/student-progress",
  "/peer-feedback",
  "/users",
  "/settings",
];

// Admin-only routes
const adminRoutes = [
  "/api/admin",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get token from cookie or Authorization header
  const token = req.cookies.get("auth-token")?.value || 
                req.headers.get("authorization")?.replace("Bearer ", "");

  // Redirect to login if no token and accessing protected route
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token for protected routes
  if (token && (protectedRoutes.some(route => pathname.startsWith(route)) || 
                adminRoutes.some(route => pathname.startsWith(route)))) {
    try {
      const decoded = verifyToken(token);
      
      if (!decoded || typeof decoded !== "object") {
        // Invalid token - redirect to login
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check admin-only routes
      if (adminRoutes.some(route => pathname.startsWith(route)) && 
          decoded.role !== "ADMIN") {
        return NextResponse.json(
          { success: false, error: "Access denied. Admin role required." },
          { status: 403 }
        );
      }

      // Attach user info to request headers for API routes
      if (pathname.startsWith("/api")) {
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", String(decoded.userId || decoded.id));
        requestHeaders.set("x-user-email", decoded.email);
        requestHeaders.set("x-user-role", decoded.role);
        requestHeaders.set("x-user-name", decoded.name);

        return NextResponse.next({
          request: { headers: requestHeaders },
        });
      }
    } catch (error) {
      console.error("Middleware token verification error:", error);
      
      // Invalid token - redirect to login
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
