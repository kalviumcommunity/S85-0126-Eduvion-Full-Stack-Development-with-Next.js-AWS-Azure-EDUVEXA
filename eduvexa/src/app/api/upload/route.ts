import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
region: process.env.AWS_REGION || "eu-north-1",
  
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function POST(req: Request) {
  try {
    console.log("✅ API HIT");

    // ✅ Safe JSON parsing
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { filename, fileType } = body;

    // ✅ Validate inputs
    if (!filename || !fileType) {
      return NextResponse.json(
        { success: false, message: "filename and fileType required" },
        { status: 400 }
      );
    }

    // ✅ Validate file type
    if (
      !fileType.startsWith("image/") &&
      fileType !== "application/pdf"
    ) {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" },
        { status: 400 }
      );
    }

    // ✅ Unique key to avoid overwrites
    const uniqueKey = `uploads/${randomUUID()}-${filename}`;

    console.log("Uploading key:", uniqueKey);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });

    console.log("✅ SIGNED URL GENERATED");

    return NextResponse.json({
      success: true,
      uploadURL,
      key: uniqueKey,
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate URL" },
      { status: 500 }
    );
  }
}
