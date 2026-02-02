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

    const userId = user.id;

    // Get user's tasks count
    const totalTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
      },
    });

    const completedTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: "COMPLETED",
      },
    });

    const inProgressTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: "IN_PROGRESS",
      },
    });

    // Get user's projects
    const ownedProjects = await prisma.project.count({
      where: {
        ownerId: userId,
      },
    });

    // Get feedback stats
    const feedbackGiven = await prisma.feedback.count({
      where: {
        fromUserId: userId,
      },
    });

    const feedbackReceived = await prisma.feedback.aggregate({
      where: {
        toUserId: userId,
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    // Calculate engagement score
    const engagementScore = calculateEngagementScore({
      totalTasks,
      completedTasks,
      feedbackGiven,
      feedbackReceived: feedbackReceived._count.id,
    });

    // Get recent activity
    const recentActivity = await prisma.activityLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent tasks
    const recentTasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        project: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          ownedProjects,
          feedbackGiven,
          feedbackReceived: feedbackReceived._count.id,
          averageRating: feedbackReceived._avg.rating || 0,
          engagementScore,
        },
        recentActivity,
        recentTasks,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateEngagementScore(data: {
  totalTasks: number;
  completedTasks: number;
  feedbackGiven: number;
  feedbackReceived: number;
}): number {
  let score = 0;

  // Task completion (40% of score)
  if (data.totalTasks > 0) {
    score += (data.completedTasks / data.totalTasks) * 40;
  }

  // Feedback participation (30% of score)
  score += Math.min(data.feedbackGiven * 5, 30);

  // Feedback received (20% of score)
  score += Math.min(data.feedbackReceived * 3, 20);

  // Base score for having tasks (10% of score)
  if (data.totalTasks > 0) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
}
