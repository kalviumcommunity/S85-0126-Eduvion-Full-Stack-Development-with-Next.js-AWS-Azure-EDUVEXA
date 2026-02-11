# File Upload API with AWS S3 Pre-Signed URLs

A secure, scalable file upload system for the Eduvexa platform using AWS S3 pre-signed URLs. This implementation allows clients to upload files directly to S3 without exposing backend credentials, improving security and reducing server load.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Implementation Details](#implementation-details)
- [Security Considerations](#security-considerations)
- [Testing](#testing)
- [Database Schema](#database-schema)
- [Reflection & Best Practices](#reflection--best-practices)

---

## Overview

### Why Pre-Signed URLs?

Traditional file uploads through your backend can create several problems:

| Challenge | Pre-Signed URL Solution |
|-----------|------------------------|
| **Server Overload** | Backend only generates URLs, files bypass server entirely |
| **Credential Exposure** | AWS credentials stay on backend, never exposed to client |
| **Scalability** | Direct client-to-S3 uploads scale infinitely |
| **Performance** | Reduced latency since files don't pass through app server |
| **Cost** | Reduced bandwidth costs on your server |

### Upload Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. POST /api/upload
       │    (filename, mimeType)
       │
       ▼
┌─────────────────────────────┐
│  Backend: Generate URL      │
│  - Validate file type/size  │
│  - Create S3 PutObject cmd  │
│  - Return signed URL        │
└──────┬──────────────────────┘
       │ 2. Signed URL + expiry
       │
       ▼
┌─────────────────────────────┐
│  Client: Upload File        │
│  - PUT request to S3        │
│  - Direct S3 upload         │
└──────┬──────────────────────┘
       │ 3. File data
       │
       ▼
┌──────────────────────────────┐
│  AWS S3: Store File          │
│  - Direct write from client  │
│  - S3 returns success        │
└──────┬───────────────────────┘
       │ 4. S3 confirmation
       │
       ▼
┌──────────────────────────────┐
│  Client: Save Metadata       │
│  - POST /api/files           │
│  - Store file record in DB   │
└──────────────────────────────┘
```

---

## Architecture

### Components

1. **Upload API Route** (`/api/upload`)
   - Validates file type and size
   - Generates AWS S3 pre-signed URLs
   - Returns temporary upload URL with 60-second expiry

2. **File Storage API Route** (`/api/files`)
   - Stores file metadata in PostgreSQL database
   - Tracks file ownership, size, MIME type, and timestamps
   - Provides retrieval and deletion endpoints

3. **Prisma Data Model**
   - `File` table stores upload metadata
   - Links to `User` table for ownership tracking
   - Supports file expiration for lifecycle management

### Technology Stack

- **Cloud Storage**: AWS S3
- **ORM**: Prisma with PostgreSQL
- **Runtime**: Next.js App Router (API Routes)
- **SDK**: @aws-sdk/client-s3 & @aws-sdk/s3-request-presigner

---

## Setup Instructions

### 1. Install Dependencies

The required AWS SDK packages are already installed:

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Check `package.json` to verify:
- `@aws-sdk/client-s3@^3.980.0`
- `@aws-sdk/s3-request-presigner@^3.980.0`

### 2. Configure AWS Credentials

Add the following environment variables to `.env.local`:

```env
# AWS Configuration
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key

# Database (Already configured)
DATABASE_URL=postgresql://user:password@localhost:5432/eduvexa
```

**Important Security Notes:**
- Never commit `.env.local` to version control
- Use IAM roles in production instead of hardcoded credentials
- Rotate access keys regularly
- Use AWS KMS for encryption at rest

### 3. Create S3 Bucket Configuration

In AWS Console:

1. Create S3 bucket (e.g., `eduvexa-uploads`)
2. Enable versioning for file recovery
3. Configure lifecycle policy:
   ```json
   {
     "Rules": [
       {
         "Id": "DeleteOldUploads",
         "Status": "Enabled",
         "Prefix": "uploads/",
         "ExpirationInDays": 30,
         "NoncurrentVersionExpirationInDays": 7
       }
     ]
   }
   ```

4. Block public access if files should be private
5. Enable CORS for client-side uploads:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST"],
       "AllowedOrigins": ["http://localhost:3000", "https://yourdomain.com"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

### 4. Update Prisma Schema

The `File` model is already added to `prisma/schema.prisma`:

```prisma
model File {
  id        Int       @id @default(autoincrement())
  name      String
  url       String
  key       String    @unique
  size      Int?
  mimeType  String
  uploadedBy Int?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  expiresAt DateTime?

  uploader User? @relation(fields: [uploadedBy], references: [id], onDelete: SetNull)

  @@index([uploadedBy])
  @@index([createdAt])
}
```

### 5. Run Prisma Migration

```bash
# Create and run migration
npx prisma migrate dev --name add_file_model

# Generate Prisma client
npx prisma generate
```

---

## API Endpoints

### 1. Generate Pre-Signed Upload URL

**Endpoint:** `POST /api/upload`

**Request:**
```json
{
  "filename": "profile-photo.jpg",
  "fileType": "image/jpeg"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "uploadURL": "https://your-bucket.s3.amazonaws.com/uploads/uuid-profile-photo.jpg?...",
  "key": "uploads/uuid-profile-photo.jpg"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Unsupported file type"
}
```

**Validations:**
- ✅ filename and fileType required
- ✅ Allowed types: `image/*` (png, jpeg, gif, webp), `application/pdf`
- ✅ URL expires in 60 seconds (configurable in route)
- ✅ Unique key prevents overwrites: `uploads/{uuid}-{filename}`

---

### 2. Upload File to S3 (Client-Side)

**After receiving the signed URL from `/api/upload`:**

```javascript
async function uploadFileToS3(file, uploadURL) {
  const response = await fetch(uploadURL, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed: ${response.statusText}`);
  }

  return uploadURL.split("?")[0]; // Return S3 public URL
}
```

---

### 3. Store File Metadata in Database

**Endpoint:** `POST /api/files`

**Request:**
```json
{
  "name": "profile-photo.jpg",
  "url": "https://your-bucket.s3.amazonaws.com/uploads/uuid-profile-photo.jpg",
  "key": "uploads/uuid-profile-photo.jpg",
  "size": 2048576,
  "mimeType": "image/jpeg",
  "uploadedBy": 1,
  "expiresAt": "2026-03-06T12:00:00Z"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "File metadata stored successfully",
  "file": {
    "id": 1,
    "name": "profile-photo.jpg",
    "url": "https://your-bucket.s3.amazonaws.com/uploads/uuid-profile-photo.jpg",
    "key": "uploads/uuid-profile-photo.jpg",
    "size": 2048576,
    "mimeType": "image/jpeg",
    "uploadedBy": 1,
    "createdAt": "2026-02-04T10:30:00Z",
    "updatedAt": "2026-02-04T10:30:00Z",
    "expiresAt": "2026-03-06T12:00:00Z",
    "uploader": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 4. Retrieve User's Uploaded Files

**Endpoint:** `GET /api/files?uploadedBy=1`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "files": [
    {
      "id": 1,
      "name": "profile-photo.jpg",
      "url": "https://your-bucket.s3.amazonaws.com/uploads/uuid-1.jpg",
      "key": "uploads/uuid-1.jpg",
      "size": 2048576,
      "mimeType": "image/jpeg",
      "uploadedBy": 1,
      "createdAt": "2026-02-04T10:30:00Z",
      "uploader": { "id": 1, "name": "John Doe", "email": "john@example.com" }
    }
  ]
}
```

---

### 5. Delete File Metadata

**Endpoint:** `DELETE /api/files?key=uploads/uuid-filename`

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "File metadata deleted successfully",
  "file": {
    "id": 1,
    "key": "uploads/uuid-profile-photo.jpg",
    "name": "profile-photo.jpg"
  }
}
```

**Note:** This only deletes the database record. To delete from S3, use AWS SDK:
```javascript
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const command = new DeleteObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: "uploads/uuid-filename",
});
await s3Client.send(command);
```

---

## Implementation Details

### File Type Validation

The API validates both filename and MIME type to prevent malicious uploads:

```typescript
const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "application/pdf",
];

if (!allowedMimeTypes.includes(mimeType)) {
  return NextResponse.json(
    { success: false, message: "File MIME type not allowed" },
    { status: 400 }
  );
}
```

**Validation Strategy:**
- ✅ Backend validates MIME type before URL generation
- ✅ Frontend should also validate (reduce round trips)
- ✅ S3 Content-Type header enforced in signed URL
- ✅ Whitelist approach (only allow known safe types)

### Unique Key Generation

To prevent file collisions and enable versioning:

```typescript
import { randomUUID } from "crypto";

const uniqueKey = `uploads/${randomUUID()}-${filename}`;
// Result: uploads/f47ac10b-58cc-4372-a567-0e02b2c3d479-profile-photo.jpg
```

**Benefits:**
- ✅ No overwrites of existing files
- ✅ Multiple uploads of same filename possible
- ✅ Easy to parse and organize in S3 console
- ✅ Collision-proof with UUID v4

### Expiry Management

Signed URLs expire automatically:

```typescript
const uploadURL = await getSignedUrl(s3, command, {
  expiresIn: 60, // 60 seconds
});
```

**Considerations:**
- Keep TTL short (30-120 seconds) for security
- Client should request new URL if first expires
- S3 enforces expiry server-side
- Database can track when files expire for cleanup

---

## Security Considerations

### 1. Credential Management

| Practice | Implementation |
|----------|-----------------|
| **Keep credentials off frontend** | Pre-signed URLs are temporary and limited in scope |
| **Rotate keys regularly** | Use AWS IAM access key rotation |
| **Use IAM roles in production** | EC2/Lambda assume role instead of hardcoded keys |
| **Never commit .env to git** | Add to .gitignore and use deployment secrets |

### 2. File Validation

| Threat | Mitigation |
|--------|-----------|
| **Malicious file types** | Whitelist allowed MIME types (images, PDF only) |
| **Oversized uploads** | Validate file size before URL generation |
| **Path traversal** | Use random UUID in key, no user input in path |
| **Zip bombs** | Limit file size (e.g., max 10MB) |

### 3. Access Control

| Scenario | Best Practice |
|----------|-----------------|
| **Public files** | Use CloudFront or S3 public URLs with lifecycle policy |
| **Private files** | Block S3 public access, use signed URLs for retrieval |
| **User's own files** | Verify `uploadedBy` matches authenticated user ID |
| **Shared files** | Implement database-level sharing rules |

### 4. Lifecycle Policies

Configure S3 lifecycle to automatically clean up old files:

```json
{
  "Rules": [
    {
      "Id": "DeleteUploads30Days",
      "Filter": { "Prefix": "uploads/" },
      "Expiration": { "Days": 30 },
      "Status": "Enabled"
    },
    {
      "Id": "DeleteNoncurrentVersions",
      "NoncurrentVersionExpiration": { "NoncurrentDays": 7 },
      "Status": "Enabled"
    }
  ]
}
```

**Benefits:**
- ✅ Automatic cleanup saves costs
- ✅ Complies with data retention policies
- ✅ Prevents storage bloat
- ✅ Version management reduces mistakes

### 5. Encryption

**At Rest (S3):**
```typescript
// Enable in bucket configuration or:
const command = new PutObjectCommand({
  Bucket: process.env.AWS_BUCKET_NAME,
  Key: uniqueKey,
  ServerSideEncryption: "AES256", // or "aws:kms"
  SSEKMSKeyId: "arn:aws:kms:region:account:key/id", // if using KMS
});
```

**In Transit:**
- ✅ HTTPS enforced for all requests
- ✅ S3 API requires SSL/TLS
- ✅ Next.js dev server supports HTTPS

---

## Testing

### Prerequisites

```bash
# Ensure AWS credentials are set
echo $AWS_REGION
echo $AWS_BUCKET_NAME

# Ensure database is running
npx prisma db push
```

### Test 1: Generate Pre-Signed URL

Using `curl`:

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test-image.jpg",
    "fileType": "image/jpeg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "uploadURL": "https://your-bucket.s3.amazonaws.com/uploads/...",
  "key": "uploads/..."
}
```

### Test 2: Upload File to S3

```bash
# Get signed URL first
SIGNED_URL=$(curl -s -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.jpg","fileType":"image/jpeg"}' | jq -r '.uploadURL')

# Upload file to S3
curl -X PUT "$SIGNED_URL" \
  -H "Content-Type: image/jpeg" \
  --data-binary @test-image.jpg
```

### Test 3: Store File Metadata

```bash
curl -X POST http://localhost:3000/api/files \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-image.jpg",
    "url": "https://your-bucket.s3.amazonaws.com/uploads/uuid-test.jpg",
    "key": "uploads/uuid-test.jpg",
    "size": 102400,
    "mimeType": "image/jpeg",
    "uploadedBy": 1
  }'
```

### Test 4: Retrieve User Files

```bash
curl http://localhost:3000/api/files?uploadedBy=1
```

### Test 5: Frontend Integration Test

**Create a test file `test-upload.ts`:**

```typescript
async function testFileUpload() {
  const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });

  // Step 1: Get signed URL
  const urlRes = await fetch("/api/upload", {
    method: "POST",
    body: JSON.stringify({
      filename: file.name,
      fileType: file.type,
    }),
  });

  const { uploadURL, key } = await urlRes.json();
  console.log("✅ Signed URL generated:", uploadURL);

  // Step 2: Upload to S3
  const uploadRes = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  console.log("✅ File uploaded to S3:", uploadRes.ok);

  // Step 3: Store metadata
  const metadataRes = await fetch("/api/files", {
    method: "POST",
    body: JSON.stringify({
      name: file.name,
      url: uploadURL.split("?")[0],
      key,
      size: file.size,
      mimeType: file.type,
      uploadedBy: 1,
    }),
  });

  const { file: savedFile } = await metadataRes.json();
  console.log("✅ Metadata stored:", savedFile);
}

testFileUpload();
```

---

## Database Schema

### File Model

```prisma
model File {
  id        Int       @id @default(autoincrement())
  name      String    // Original filename from client
  url       String    // Full S3 public/signed URL
  key       String    @unique // S3 object key for deletion/retrieval
  size      Int?      // File size in bytes
  mimeType  String    // Content-Type (image/jpeg, application/pdf, etc.)
  uploadedBy Int?     // User ID of uploader
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  expiresAt DateTime?  // Optional expiration timestamp

  // Relations
  uploader User? @relation(fields: [uploadedBy], references: [id], onDelete: SetNull)

  // Indexes for fast queries
  @@index([uploadedBy])
  @@index([createdAt])
  @@index([expiresAt])
}
```

### Queries

**Get all files by user:**
```typescript
const userFiles = await prisma.file.findMany({
  where: { uploadedBy: userId },
  orderBy: { createdAt: "desc" },
});
```

**Get expired files for cleanup:**
```typescript
const expiredFiles = await prisma.file.findMany({
  where: {
    expiresAt: { lte: new Date() },
  },
});
```

**Delete expired files:**
```typescript
await prisma.file.deleteMany({
  where: {
    expiresAt: { lte: new Date() },
  },
});
```

---

## Reflection & Best Practices

### Trade-offs: Public vs Private File Access

#### Public Files
```
Pros:
✅ No authentication needed for downloads
✅ Can use CloudFront CDN for distribution
✅ Faster access for widely shared files

Cons:
❌ Anyone with URL can access (no real privacy)
❌ Potential for enumeration attacks
❌ Not suitable for sensitive data
```

**Use Case:** Profile photos, portfolio projects, public documents

#### Private Files
```
Pros:
✅ True access control through database
✅ Audit trail of who accessed what
✅ Can revoke access by deleting DB record
✅ Suitable for sensitive data

Cons:
❌ Requires authentication for each download
❌ Higher latency (can't use public CDN)
❌ More complex implementation
```

**Use Case:** Student submissions, assessment files, personal documents

**Implementation:**
```typescript
// Private file retrieval
export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");
  const fileId = searchParams.get("id");

  // Verify ownership
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (file.uploadedBy !== parseInt(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Generate temporary download URL
  const downloadUrl = await getSignedUrl(s3, new GetObjectCommand(...), {
    expiresIn: 900, // 15 minutes
  });

  return NextResponse.json({ downloadUrl });
}
```

### Lifecycle Management Strategy

| Phase | Duration | Action |
|-------|----------|--------|
| **Active** | 0-30 days | Keep in standard S3 storage, accessible |
| **Archive** | 30-90 days | Move to S3 Glacier for long-term retention |
| **Expiry** | 90+ days | Delete permanently from all systems |

**Cost Optimization:**
- Standard storage: $0.023 per GB/month
- Glacier storage: $0.004 per GB/month (cheaper but slower)
- 30-day cycle saves ~82% on old file storage

**Implementation:**
```json
{
  "Rules": [
    {
      "Id": "TransitionToGlacier",
      "Filter": { "Prefix": "uploads/" },
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 90
      },
      "Status": "Enabled"
    }
  ]
}
```

### Monitoring & Logging

```typescript
// Log all uploads
console.log({
  timestamp: new Date(),
  action: "file_upload_url_generated",
  filename,
  mimeType,
  key: uniqueKey,
  expiresIn: 60,
});

// Log database storage
console.log({
  timestamp: new Date(),
  action: "file_metadata_stored",
  fileId: fileRecord.id,
  uploadedBy: uploadedBy,
  size: size,
});
```

### Error Handling Best Practices

```typescript
try {
  // Validation
  if (!filename || !fileType) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 } // Client error
    );
  }

  // AWS operation
  const url = await getSignedUrl(...);

  // Success
  return NextResponse.json({
    success: true,
    uploadURL: url,
    key: uniqueKey,
  });
} catch (error) {
  // Check error type
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  // Unknown error
  console.error("Upload error:", error);
  return NextResponse.json(
    { success: false, message: "Server error" },
    { status: 500 }
  );
}
```

---

## Production Deployment Checklist

- [ ] AWS credentials stored in deployment environment secrets (not in code)
- [ ] S3 bucket CORS configured for your production domain
- [ ] S3 lifecycle policies configured for cost optimization
- [ ] CloudFront distribution set up for public files (optional)
- [ ] Database migrations applied to production
- [ ] File size limits configured (e.g., max 10MB)
- [ ] Error logging integrated with monitoring service (e.g., Sentry)
- [ ] Rate limiting added to `/api/upload` to prevent abuse
- [ ] HTTPS enforced for all requests
- [ ] S3 public access blocked if files should be private
- [ ] CloudWatch logs enabled for S3 bucket operations
- [ ] Backup/disaster recovery plan for database

---

## Summary

This implementation provides:

✅ **Secure**: Credentials never exposed to clients, temporary URLs with short expiry
✅ **Scalable**: Backend handles only URL generation, S3 handles storage
✅ **Performant**: Direct client-to-cloud uploads reduce latency
✅ **Maintainable**: Clear separation of concerns (validation, upload, storage)
✅ **Auditable**: Database tracks all uploads and ownership
✅ **Cost-Effective**: Lifecycle policies reduce long-term storage costs

The key insight: **Pre-signed URLs are the bridge between frontend convenience and backend security.**

---

**Last Updated:** February 4, 2026
**Maintained by:** Eduvexa Development Team
