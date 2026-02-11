import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
// OWASP: Import input sanitization utility
import { sanitizeInput } from "@/lib/sanitizeInput";
import { z } from "zod";
import { logger } from "@/lib/logger";

// CORS configuration helper
function setCORSHeaders(response: NextResponse, origin?: string) {
  const allowedOrigins = [
    process.env.NODE_ENV === 'production' 
      ? 'https://eduvexa.vercel.app' 
      : 'http://localhost:3000',
    'http://localhost:3000', // Always allow localhost for development
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin') || undefined;
  const response = new NextResponse(null, { status: 200 });
  return setCORSHeaders(response, origin);
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin') || undefined;
  
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      const errorResponse = NextResponse.json(
        { message: "Email and password required" },
        { status: 400 }
      );
      return setCORSHeaders(errorResponse, origin);
    }

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  const { requestId, startTime } = logger.createRequestContext();
  
  try {
    const body = await req.json();
    
    // Log API request
    logger.logApiRequest('POST', '/api/auth/login', requestId, undefined, { 
      email: body.email 
    });
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    // OWASP: Sanitize user-controlled input before DB lookup
    const email = sanitizeInput(validatedData.email);
    const password = validatedData.password; // Passwords should not be sanitized

    // Find user
    logger.logDatabaseOperation('findUnique', 'user', requestId, undefined, { 
      email 
    });
    
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const errorResponse = NextResponse.json(
        { message: "Invalid credentials" },
      logger.logAuthError('login', 'Invalid credentials - user not found', undefined, requestId, { 
        email 
      });
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },

        { status: 401 }
      );
      return setCORSHeaders(errorResponse, origin);
    }

    // Verify password
    const isPasswordCorrect = await verifyPassword(password, user.password);

    if (!isPasswordCorrect) {
      const errorResponse = NextResponse.json(
        { message: "Invalid credentials" },

    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      logger.logAuthError('login', 'Invalid credentials - wrong password', user.id.toString(), requestId);
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },

        { status: 401 }
      );
      return setCORSHeaders(errorResponse, origin);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
    // Set auth cookie
    setAuthCookie(response, token);

    // Log successful login
    logger.logAuthEvent('login_success', user.id.toString(), requestId, { 
      email,
      role: user.role,
    });

    // Log activity
    logger.logDatabaseOperation('create', 'activityLog', requestId, user.id.toString(), {
      userId: user.id,
      action: "login",
      metadata: {
        email,
        loginTime: new Date().toISOString(),
      },
    });
    
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "login",
        metadata: {
          email,
          loginTime: new Date().toISOString(),
        },
      },
    });

    const successResponse = NextResponse.json({
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },

    const responseTime = logger.getResponseTime(startTime);
    logger.logApiSuccess('POST', '/api/auth/login', requestId, responseTime, {
      userId: user.id,
      email,
      role: user.role
    });
    
    return setCORSHeaders(successResponse, origin);
  } catch (error) {
    const errorResponse = NextResponse.json(
      { message: "Login failed" },

    return response;
  } catch (error) {
    const responseTime = logger.getResponseTime(startTime);
    logger.logApiError('POST', '/api/auth/login', requestId, error as Error, { responseTime });
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: error.issues.map((e) => ({ field: e.path[0], message: e.message }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
    return setCORSHeaders(errorResponse, origin);
  }
}
