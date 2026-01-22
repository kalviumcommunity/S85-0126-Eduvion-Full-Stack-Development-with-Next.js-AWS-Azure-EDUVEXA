import { ZodError } from "zod";
import { userSchema } from "@/lib/schemas/userSchema";
import { safeRedisOperation } from "@/lib/redis";
import { sendSuccess, sendError, ERROR_CODES } from "@/lib/responseHandler";

// GET /api/users?page=1&limit=10 (with Redis caching)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return sendError(
        "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    // 🔑 Cache key must include pagination
    const cacheKey = `users:list:page=${page}:limit=${limit}`;

    // 1️⃣ Check Redis cache (gracefully handle if Redis is unavailable)
    const cachedData = await safeRedisOperation(async (client) => {
      return await client.get(cacheKey);
    });

    if (cachedData) {
      console.log("⚡ Cache Hit");
      return sendSuccess(JSON.parse(cachedData), "Users fetched successfully");
    }

    console.log("🐢 Cache Miss - Fetching data");

    const start = (page - 1) * limit;

    // Mock data (replace with actual database query)
    const users = [
      { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
      { id: 2, name: "Bob", email: "bob@example.com", age: 30 },
      { id: 3, name: "Charlie", email: "charlie@example.com", age: 28 },
      { id: 4, name: "David", email: "david@example.com", age: 35 },
    ];

    const paginatedUsers = users.slice(start, start + limit);

    const response = {
      page,
      limit,
      total: users.length,
      data: paginatedUsers,
    };

    // 2️⃣ Store in Redis with TTL = 60 seconds (gracefully handle if Redis is unavailable)
    await safeRedisOperation(async (client) => {
      await client.set(cacheKey, JSON.stringify(response), "EX", 60);
    });

    return sendSuccess(response, "Users fetched successfully");
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return sendError(
      "Failed to fetch users",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : undefined
    );
  }
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the incoming data using Zod schema
    const validatedData = userSchema.parse(body);

    // TODO: Save to database here
    // const newUser = await prisma.user.create({ data: validatedData });

    // Invalidate cache when creating a new user
    // This ensures the next GET request fetches fresh data
    await safeRedisOperation(async (client) => {
      // Delete all user list cache entries (pattern matching)
      const keys = await client.keys("users:list:*");
      if (keys.length > 0) {
        await client.del(...keys);
        console.log(`🗑️ Invalidated ${keys.length} cache entries`);
      }
    });

    return sendSuccess(
      validatedData,
      "User created successfully",
      201
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return sendError(
        "Validation Error",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((issue) => ({
          field: String(issue.path[0]),
          message: issue.message,
        }))
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return sendError(
        "Invalid JSON format",
        ERROR_CODES.INVALID_INPUT,
        400
      );
    }

    console.error("Error in POST /api/users:", error);
    return sendError(
      "Failed to create user",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error instanceof Error ? error.message : undefined
    );
  }
}
