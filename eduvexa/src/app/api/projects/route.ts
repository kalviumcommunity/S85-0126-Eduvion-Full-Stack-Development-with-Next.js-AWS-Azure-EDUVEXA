import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/projects - Get all projects with stats
export async function GET(req: NextRequest) {
  try {
    // Get user from request (for authentication)
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }

    if (status !== "ALL") {
      where.status = status;
    }

    // Get projects with their stats
    const projects = await prisma.project.findMany({
      where,
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Get task stats for each project
    const projectsWithTaskStats = await Promise.all(
      projects.map(async (project) => {
        const taskStats = await prisma.task.groupBy({
          by: ['status'],
          where: {
            projectId: project.id,
          },
          _count: {
            id: true,
          },
        });

        const tasksByStatus = {
          PENDING: 0,
          IN_PROGRESS: 0,
          COMPLETED: 0,
        };

        taskStats.forEach(stat => {
          tasksByStatus[stat.status as keyof typeof tasksByStatus] = stat._count.id;
        });

        return {
          ...project,
          tasks: [
            { where: { status: "PENDING" }, _count: { id: tasksByStatus.PENDING } },
            { where: { status: "IN_PROGRESS" }, _count: { id: tasksByStatus.IN_PROGRESS } },
            { where: { status: "COMPLETED" }, _count: { id: tasksByStatus.COMPLETED } },
          ]
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        projects: projectsWithTaskStats,
      },
    });
  } catch (error) {
    console.error("Get projects error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(req: NextRequest) {
  try {
    // Get user from request
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { title, description, status = "ACTIVE" } = await req.json();

    // Validate input
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        ownerId: user.id,
      },
      include: {
        owner: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "project_created",
        metadata: {
          projectId: project.id,
          title: project.title,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
