import { NextResponse } from "next/server";
import { hasPermission, Action } from "@/lib/rbacConfig";
import { getUserFromRequest } from "@/lib/auth"; // assumes you have a helper for this

export function withRBAC(action: Action, handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    const user = await getUserFromRequest(req);
    const role = user?.role || "viewer";
    const allowed = hasPermission(role, action);

    console.log(`[RBAC] role=${role} action=${action} result=${allowed ? "ALLOWED" : "DENIED"}`);

    if (!allowed) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }
    return handler(req);
  };
}
