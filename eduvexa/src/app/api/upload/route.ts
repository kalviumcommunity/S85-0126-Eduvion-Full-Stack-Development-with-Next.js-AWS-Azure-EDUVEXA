import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

export async function POST(req: Request) {
  try {
    const { filename, fileType } = await req.json();

    // ✅ Validate file type
    if (
      !fileType.startsWith("image/") &&
      !fileType.startsWith("application/pdf")
    ) {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" },
        { status: 400 }
      );
    }

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: filename,
      ContentType: fileType,
    });

    const uploadURL = await getSignedUrl(s3, command, {
      expiresIn: 60,
    });

    return NextResponse.json({
      success: true,
      uploadURL,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to generate URL" },
      { status: 500 }
    );
  }
}
