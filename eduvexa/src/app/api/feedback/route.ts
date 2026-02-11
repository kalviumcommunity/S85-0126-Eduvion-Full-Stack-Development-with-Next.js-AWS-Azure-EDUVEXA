import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { logger } from "@/lib/logger";

const feedbackSchema = z.object({
  toUserId: z.string().min(1, "Recipient is required"),
  rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  strengths: z.string().optional(),
  improvements: z.string().optional(),
});

// POST /api/feedback - Create new feedback
export async function POST(req: NextRequest) {
  const { requestId, startTime } = logger.createRequestContext();
  
  try {
    // Get user from request
    const user = await getUserFromRequest(req);
    
    if (!user) {
      logger.logApiError('POST', '/api/feedback', requestId, 'Not authenticated');
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Log API request
    logger.logApiRequest('POST', '/api/feedback', requestId, user.id.toString(), { 
      toUserId: body.toUserId,
      rating: body.rating,
      category: body.category 
    });
    
    // Validate input
    const validatedData = feedbackSchema.parse(body);

    // Check if user is trying to give feedback to themselves
    if (Number(validatedData.toUserId) === user.id) {
      logger.logApiError('POST', '/api/feedback', requestId, 'Cannot give feedback to yourself', { 
        userId: user.id,
        toUserId: validatedData.toUserId 
      });
      return NextResponse.json(
        { success: false, error: "Cannot give feedback to yourself" },
        { status: 400 }
      );
    }

    // Create feedback
    const toUserId = Number(validatedData.toUserId);
    
    logger.logDatabaseOperation('create', 'feedback', requestId, user.id.toString(), {
      fromUserId: user.id,
      toUserId,
      rating: validatedData.rating,
      category: validatedData.category
    });
    
    const feedback = await prisma.feedback.create({
      data: {
        fromUserId: user.id,
        toUserId,
        rating: Number(validatedData.rating),
        comment: validatedData.comment,
        category: validatedData.category,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Log activity
    logger.logDatabaseOperation('create', 'activityLog', requestId, user.id.toString(), {
      userId: user.id,
      action: "feedback_given",
      feedbackId: feedback.id,
      toUserId: validatedData.toUserId,
      rating: validatedData.rating,
      category: validatedData.category,
    });
    
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "feedback_given",
        metadata: {
          feedbackId: feedback.id,
          toUserId: validatedData.toUserId,
          rating: validatedData.rating,
          category: validatedData.category,
        },
      },
    });

    const responseTime = logger.getResponseTime(startTime);
    logger.logApiSuccess('POST', '/api/feedback', requestId, responseTime, {
      feedbackId: feedback.id,
      toUserId: validatedData.toUserId
    });

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      data: { feedback },
    });
  } catch (error) {
    const responseTime = logger.getResponseTime(startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.logApiError('POST', '/api/feedback', requestId, errorMessage, { responseTime });
    
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

// GET /api/feedback - Get feedback for a user
export async function GET(req: NextRequest) {
  const { requestId, startTime } = logger.createRequestContext();
  
  try {
    // Get user from request
    const user = await getUserFromRequest(req);
    
    if (!user) {
      logger.logApiError('GET', '/api/feedback', requestId, 'Not authenticated');
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "received"; // "given" or "received"
    const userId = searchParams.get("userId") || user.id;

    // Log API request
    logger.logApiRequest('GET', '/api/feedback', requestId, user.id.toString(), { 
      type,
      userId 
    });

    const where = type === "given" 
      ? { fromUserId: user.id }
      : { toUserId: userId };

    logger.logDatabaseOperation('findMany', 'feedback', requestId, user.id.toString(), { 
      type,
      userId,
      where 
    });
    
    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get feedback statistics
    logger.logDatabaseOperation('groupBy', 'feedback', requestId, user.id.toString(), { 
      type,
      userId 
    });
    
    const stats = await prisma.feedback.groupBy({
      by: ['rating'],
      where: type === "given" ? { fromUserId: user.id } : { toUserId: userId },
      _count: {
        id: true,
      },
    });

    const totalFeedback = feedback.length;
    const averageRating = stats.reduce((sum: number, stat: any) => sum + (stat.rating * stat._count.id), 0) / totalFeedback || 0;

    const responseTime = logger.getResponseTime(startTime);
    logger.logApiSuccess('GET', '/api/feedback', requestId, responseTime, {
      totalFeedback,
      averageRating,
      statsCount: stats.length
    });

    return NextResponse.json({
      success: true,
      data: {
        feedback,
        stats: {
          total: totalFeedback,
          averageRating: Math.round(averageRating * 10) / 10,
          ratingDistribution: stats,
        },
      },
    });
  } catch (error) {
    const responseTime = logger.getResponseTime(startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.logApiError('GET', '/api/feedback', requestId, errorMessage, { responseTime });
    
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
