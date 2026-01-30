import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const errorResponse = NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
      return setCORSHeaders(errorResponse, origin);
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      const errorResponse = NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
      return setCORSHeaders(errorResponse, origin);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const successResponse = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
    return setCORSHeaders(successResponse, origin);
  } catch (error) {
    const errorResponse = NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
    return setCORSHeaders(errorResponse, origin);
  }
}
