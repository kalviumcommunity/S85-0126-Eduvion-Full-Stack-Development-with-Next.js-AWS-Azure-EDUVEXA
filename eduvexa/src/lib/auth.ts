import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: { userId: number; email: string; role: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Extract user from request (for RBAC middleware)
export async function getUserFromRequest(req: Request) {
  // First try to get from Authorization header (for API calls)
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);
    if (payload && typeof payload === "object") {
      return {
        email: payload.email,
        role: payload.role || "STUDENT",
        id: payload.userId || payload.id,
        name: payload.name,
      };
    }
  }

  // If no header, try to get from cookie (for browser requests)
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [name, value] = cookie.trim().split('=');
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const token = cookies['auth-token'];
    if (token) {
      const payload = verifyToken(token);
      if (payload && typeof payload === "object") {
        return {
          email: payload.email,
          role: payload.role || "STUDENT",
          id: payload.userId || payload.id,
          name: payload.name,
        };
      }
    }
  }

  return null;
}

// Set HTTP-only cookie (NextResponse)
export function setAuthCookie(res: Response, token: string) {
  const response = res as NextResponse;
  response.cookies?.set?.("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });
}

// Clear auth cookie
export function clearAuthCookie(res: Response) {
  const response = res as NextResponse;
  response.cookies?.delete?.("auth-token");
}
