import jwt from "jsonwebtoken";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

// Extract user from request (for RBAC middleware)
export async function getUserFromRequest(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  const payload = verifyToken(token);
  if (!payload || typeof payload !== "object") return null;
  // Assumes JWT payload contains 'role' and 'email' fields
  return {
    email: payload.email,
    role: payload.role || "viewer",
    id: payload.userId || payload.id,
    name: payload.name,
  };
}
