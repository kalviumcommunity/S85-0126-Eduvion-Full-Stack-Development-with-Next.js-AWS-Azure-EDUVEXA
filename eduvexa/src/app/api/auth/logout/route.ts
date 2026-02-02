
import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // Get user from request for activity logging
    const user = await getUserFromRequest(req);
    
    // Log logout activity if user is found
    if (user) {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "logout",
          metadata: {
            email: user.email,
          },
        },
      });
    }

    // Create response and clear auth cookie
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    clearAuthCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optionally support GET for logout (if your frontend uses GET)
export async function GET(req: NextRequest) {
  return POST(req);
}
