import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    message: "Protected data accessed",
    user,
  });
}
