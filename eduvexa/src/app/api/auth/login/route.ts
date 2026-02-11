import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
// OWASP: Import input sanitization utility
import { sanitizeInput } from "@/lib/sanitizeInput";
import { z } from "zod";
import { logger } from "@/lib/logger";

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
      logger.logAuthError('login', 'Invalid credentials - user not found', undefined, requestId, { 
        email 
      });
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      logger.logAuthError('login', 'Invalid credentials - wrong password', user.id.toString(), requestId, { 
        email 
      });
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
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
      role: user.role 
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

    const responseTime = logger.getResponseTime(startTime);
    logger.logApiSuccess('POST', '/api/auth/login', requestId, responseTime, {
      userId: user.id,
      email,
      role: user.role
    });

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
  }
}
