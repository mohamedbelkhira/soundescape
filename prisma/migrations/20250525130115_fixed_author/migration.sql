/*
  Warnings:

  - You are about to drop the column `author` on the `audiobooks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audiobooks" DROP COLUMN "author";

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiobook_authors" (
    "id" TEXT NOT NULL,
    "audiobook_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Author',
    "order" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "audiobook_authors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authors_name_key" ON "authors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "audiobook_authors_audiobook_id_author_id_role_key" ON "audiobook_authors"("audiobook_id", "author_id", "role");

-- AddForeignKey
ALTER TABLE "audiobook_authors" ADD CONSTRAINT "audiobook_authors_audiobook_id_fkey" FOREIGN KEY ("audiobook_id") REFERENCES "audiobooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiobook_authors" ADD CONSTRAINT "audiobook_authors_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
