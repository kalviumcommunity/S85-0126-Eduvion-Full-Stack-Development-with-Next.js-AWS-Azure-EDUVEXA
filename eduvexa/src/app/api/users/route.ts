import { handleError } from "@/lib/errorHandler";

export async function GET() {
  try {
    // Simulated error
    throw new Error("Database connection failed!");
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}
