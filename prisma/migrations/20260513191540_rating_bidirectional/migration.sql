-- DropIndex
DROP INDEX IF EXISTS "Rating_lessonId_key";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Rating_lessonId_idx" ON "Rating"("lessonId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Rating_lessonId_authorId_key" ON "Rating"("lessonId", "authorId");
