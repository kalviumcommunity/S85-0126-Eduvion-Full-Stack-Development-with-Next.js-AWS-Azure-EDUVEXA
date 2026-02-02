import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional(),
  bio: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    // Get user from request
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate input
    const validatedData = updateProfileSchema.parse(body);

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        // Only update email if it's provided and different
        ...(validatedData.email && validatedData.email !== user.email && {
          email: validatedData.email,
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    
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

export async function GET(req: NextRequest) {
  try {
    // Get user from request
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch full user data from database
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        bio: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            ownedProjects: true,
            assignedTasks: true,
            feedbackGiven: true,
            feedbackReceived: true,
          },
        },
      },
    });

    if (!fullUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: fullUser,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
