import { NextResponse } from "next/server";

// GET /api/users?page=1&limit=10
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const start = (page - 1) * limit;

  // Mock data
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
  ];

  const paginatedUsers = users.slice(start, start + limit);

  return NextResponse.json(
    {
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
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "User created", data: body },
    { status: 201 }
  );
}
