-- CreateTable
CREATE TABLE IF NOT EXISTS "TimeBlock" (
  "id" TEXT NOT NULL,
  "instructorId" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TimeBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TimeBlock_instructorId_startsAt_idx" ON "TimeBlock"("instructorId", "startsAt");

-- AddForeignKey
ALTER TABLE "TimeBlock"
  ADD CONSTRAINT "TimeBlock_instructorId_fkey"
  FOREIGN KEY ("instructorId") REFERENCES "InstructorProfile"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
