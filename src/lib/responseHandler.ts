import { NextResponse } from "next/server";

export const sendSuccess = (data: any, message = "Success", status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export const sendError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  status = 500,
  details?: any
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      error: { code, details },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

// Common error codes
export const ERROR_CODES = {
  // 400 Bad Request
  VALIDATION_ERROR: "E400",
  INVALID_INPUT: "E401",
  MISSING_FIELDS: "E402",
  
  // 404 Not Found
  NOT_FOUND: "E404",
  USER_NOT_FOUND: "E4041",
  RESOURCE_NOT_FOUND: "E4042",
  
  // 409 Conflict
  CONFLICT: "E409",
  DUPLICATE_ENTRY: "E4091",
  
  // 422 Unprocessable Entity
  VALIDATION_FAILED: "E422",
  
  // 500 Internal Server Error
  INTERNAL_ERROR: "E500",
  DATABASE_ERROR: "E501",
  EXTERNAL_SERVICE_ERROR: "E502",
  
  // 503 Service Unavailable
  SERVICE_UNAVAILABLE: "E503",
  MAINTENANCE_MODE: "E5031"
} as const;
