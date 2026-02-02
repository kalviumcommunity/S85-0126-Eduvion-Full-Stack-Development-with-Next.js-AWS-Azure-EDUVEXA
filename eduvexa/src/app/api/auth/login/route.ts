import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordCorrect = await verifyPassword(password, user.password);

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "login",
        metadata: {
          email,
        },
      },
    });

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
    });

    // Set HTTP-only cookie
    setAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: error.issues.map((e: any) => ({ field: e.path[0], message: e.message }))
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
