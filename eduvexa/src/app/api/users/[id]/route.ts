import { NextResponse } from "next/server";

// GET /api/users/:id
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user ID" },
      { status: 400 }
    );
  }

  // Mock condition: user not found
  if (userId > 10) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { id: userId, name: "Mock User" },
    { status: 200 }
  );
}

// PUT /api/users/:id
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id);
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "User updated", id: userId, data: body },
    { status: 200 }
  );
}

// DELETE /api/users/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = Number(params.id);

  return NextResponse.json(
    { message: "User deleted", id: userId },
    { status: 200 }
  );
}
