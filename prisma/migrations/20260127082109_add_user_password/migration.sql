/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('STUDENT', 'ADMIN');


ALTER TABLE "User"
  ADD COLUMN "password" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3),
  DROP COLUMN "role",
  ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'STUDENT';

-- Set default values for existing rows
UPDATE "User" SET "password" = 'changeme', "updatedAt" = NOW() WHERE "password" IS NULL OR "updatedAt" IS NULL;

-- Make columns NOT NULL
ALTER TABLE "User"
  ALTER COLUMN "password" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;
