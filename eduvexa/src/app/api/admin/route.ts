import { NextResponse } from "next/server";
import { withRBAC } from "@/middleware/rbac";

export const GET = withRBAC("read", async () => {
  return NextResponse.json({
    success: true,
    message: "Welcome Admin! You have full access.",
  });
});
