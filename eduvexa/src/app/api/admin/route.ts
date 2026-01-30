import { withRBAC } from "@/middleware/rbac";

export const GET = withRBAC("read", async (req) => {
  return NextResponse.json({
    success: true,
    message: "Welcome Admin! You have full access.",
  });
});
