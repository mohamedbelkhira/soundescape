/*
  Warnings:

  - You are about to drop the column `chapter_id` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_id` on the `listening_progress` table. All the data in the column will be lost.
  - You are about to drop the `audiobook_authors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chapters` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,audiobook_id]` on the table `listening_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `audio_url` to the `audiobooks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `audiobooks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audiobook_id` to the `bookmarks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "audiobook_authors" DROP CONSTRAINT "audiobook_authors_audiobook_id_fkey";

-- DropForeignKey
ALTER TABLE "audiobook_authors" DROP CONSTRAINT "audiobook_authors_author_id_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_audiobook_id_fkey";

-- DropForeignKey
ALTER TABLE "listening_progress" DROP CONSTRAINT "listening_progress_chapter_id_fkey";

-- DropIndex
DROP INDEX "listening_progress_user_id_audiobook_id_chapter_id_key";

-- AlterTable
ALTER TABLE "audiobooks" ADD COLUMN     "audio_url" TEXT NOT NULL,
ADD COLUMN     "author_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "bookmarks" DROP COLUMN "chapter_id",
ADD COLUMN     "audiobook_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "listening_progress" DROP COLUMN "chapter_id";

-- DropTable
DROP TABLE "audiobook_authors";

-- DropTable
DROP TABLE "chapters";

-- CreateIndex
CREATE UNIQUE INDEX "listening_progress_user_id_audiobook_id_key" ON "listening_progress"("user_id", "audiobook_id");

-- AddForeignKey
ALTER TABLE "audiobooks" ADD CONSTRAINT "audiobooks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_audiobook_id_fkey" FOREIGN KEY ("audiobook_id") REFERENCES "audiobooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
