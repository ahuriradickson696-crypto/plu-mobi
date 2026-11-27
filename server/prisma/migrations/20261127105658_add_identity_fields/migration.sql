-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "subCounty" TEXT,
ADD COLUMN     "village" TEXT,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "photoPath" DROP DEFAULT;

-- AlterTable
ALTER TABLE "PatrioticOfficer" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "sex" TEXT,
ADD COLUMN     "subCounty" TEXT,
ADD COLUMN     "village" TEXT,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE',
ALTER COLUMN "photoPath" DROP DEFAULT;

-- CreateTable
CREATE TABLE "IdempotencyRecord" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "responseBody" JSONB NOT NULL,
    "statusCode" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IdempotencyRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IdempotencyRecord_key_key" ON "IdempotencyRecord"("key");

-- CreateIndex
CREATE INDEX "IdempotencyRecord_expiresAt_idx" ON "IdempotencyRecord"("expiresAt");
