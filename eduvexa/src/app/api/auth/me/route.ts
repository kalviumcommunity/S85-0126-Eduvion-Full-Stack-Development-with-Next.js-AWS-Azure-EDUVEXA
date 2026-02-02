import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
