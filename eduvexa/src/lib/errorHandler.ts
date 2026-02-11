import { NextResponse } from "next/server";
import { logger } from "./logger";

export function handleError(error: any, context: string) {
  const isProd = process.env.NODE_ENV === "production";

  logger.error(`Error in ${context}`, error instanceof Error ? error : String(error));

  return NextResponse.json(
    {
      success: false,
      message: isProd
        ? "Something went wrong. Please try again later."
        : error?.message || "Unknown error",
      ...(isProd ? {} : { stack: error?.stack }),
    },
    { status: 500 }
  );
}
