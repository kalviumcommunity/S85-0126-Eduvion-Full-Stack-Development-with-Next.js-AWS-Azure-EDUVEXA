import { NextResponse, NextRequest } from "next/server";

// GET /api/users/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);

  if (isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user ID" },
      { status: 400 }
    );
  }

  // Mock user data with more realistic information
  const mockUsers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "admin", bio: "Full-stack developer passionate about education technology", avatar: null, joinDate: "2023-01-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "student", bio: "Computer science student with focus on web development", avatar: null, joinDate: "2023-02-20" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "instructor", bio: "Experienced educator teaching programming and data structures", avatar: null, joinDate: "2022-09-10" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "student", bio: "Aspiring data scientist and machine learning enthusiast", avatar: null, joinDate: "2023-03-05" },
    { id: 5, name: "Edward Norton", email: "edward@example.com", role: "admin", bio: "System administrator and DevOps engineer", avatar: null, joinDate: "2022-11-12" },
    { id: 6, name: "Fiona Green", email: "fiona@example.com", role: "instructor", bio: "UX/UI design expert and frontend development mentor", avatar: null, joinDate: "2023-01-20" },
    { id: 7, name: "George Wilson", email: "george@example.com", role: "student", bio: "Mobile app developer and React Native specialist", avatar: null, joinDate: "2023-04-15" },
    { id: 8, name: "Hannah Lee", email: "hannah@example.com", role: "student", bio: "Database administrator and SQL expert", avatar: null, joinDate: "2023-02-28" },
    { id: 9, name: "Ian McKellen", email: "ian@example.com", role: "instructor", bio: "Software architecture and design patterns expert", avatar: null, joinDate: "2022-08-05" },
    { id: 10, name: "Julia Roberts", email: "julia@example.com", role: "student", bio: "Cybersecurity enthusiast and ethical hacker", avatar: null, joinDate: "2023-05-10" },
  ];

  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}

// PUT /api/users/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);
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
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = Number(id);

  return NextResponse.json(
    { message: "User deleted", id: userId },
    { status: 200 }
  );
}
