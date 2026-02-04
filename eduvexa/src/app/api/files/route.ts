import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/files
 * Store uploaded file metadata in database after successful S3 upload
 * Called from client after file has been uploaded to S3
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, url, key, size, mimeType, uploadedBy, expiresAt } = body;

    // ✅ Validate required fields
    if (!name || !url || !key) {
      return NextResponse.json(
        { success: false, message: "name, url, and key are required" },
        { status: 400 }
      );
    }

    // ✅ Validate MIME type
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];

    if (mimeType && !allowedMimeTypes.includes(mimeType)) {
      return NextResponse.json(
        { success: false, message: "File MIME type not allowed" },
        { status: 400 }
      );
    }

    // ✅ Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        name,
        url,
        key,
        size: size || null,
        mimeType: mimeType || "application/octet-stream",
        uploadedBy: uploadedBy || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("✅ FILE RECORD CREATED:", fileRecord);

    return NextResponse.json(
      {
        success: true,
        message: "File metadata stored successfully",
        file: fileRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ ERROR storing file:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to store file metadata",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/files?uploadedBy=userId
 * Retrieve files uploaded by a specific user
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadedBy = searchParams.get("uploadedBy");

    // ✅ Build query filter
    const whereClause = uploadedBy ? { uploadedBy: parseInt(uploadedBy) } : {};

    const files = await prisma.file.findMany({
      where: whereClause,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        count: files.length,
        files,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ ERROR retrieving files:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve files",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/files?key=uploads/uuid-filename
 * Delete file metadata from database (not from S3 - handled separately)
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, message: "key parameter is required" },
        { status: 400 }
      );
    }

    const deletedFile = await prisma.file.delete({
      where: { key },
    });

    console.log("✅ FILE RECORD DELETED:", deletedFile.key);

    return NextResponse.json(
      {
        success: true,
        message: "File metadata deleted successfully",
        file: deletedFile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ ERROR deleting file:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete file metadata",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
