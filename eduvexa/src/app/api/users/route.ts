import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { userSchema } from "@/lib/schemas/userSchema";

// GET /api/users?page=1&limit=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const start = (page - 1) * limit;

  // Mock data
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
    { id: 2, name: "Bob", email: "bob@example.com", age: 30 },
    { id: 3, name: "Charlie", email: "charlie@example.com", age: 28 },
    { id: 4, name: "David", email: "david@example.com", age: 35 },
  ];

  const paginatedUsers = users.slice(start, start + limit);

  return NextResponse.json(
    {
      success: true,
      page,
      limit,
      total: users.length,
      data: paginatedUsers,
    },
    { status: 200 }
  );
}

// POST /api/users
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate the incoming data using Zod schema
    const validatedData = userSchema.parse(body);

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: validatedData,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          errors: error.issues.map((issue) => ({
            field: String(issue.path[0]),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected error",
      },
      { status: 500 }
    );
  }
}
