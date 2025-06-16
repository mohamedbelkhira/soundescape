/*
  Warnings:

  - You are about to drop the `bookmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `listening_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('FREE', 'PREMIUM', 'PREMIUM_PLUS');

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_audiobook_id_fkey";

-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "listening_progress" DROP CONSTRAINT "listening_progress_audiobook_id_fkey";

-- DropForeignKey
ALTER TABLE "listening_progress" DROP CONSTRAINT "listening_progress_user_id_fkey";

-- AlterTable
ALTER TABLE "audiobooks" ADD COLUMN     "is_premium" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "play_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "subscription_expires_at" TIMESTAMP(3),
ADD COLUMN     "subscription_type" "SubscriptionType" NOT NULL DEFAULT 'FREE';

-- DropTable
DROP TABLE "bookmarks";

-- DropTable
DROP TABLE "listening_progress";

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "country" TEXT,
    "language" TEXT DEFAULT 'en',
    "preferredGenres" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "audiobook_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_user_id_audiobook_id_key" ON "favorites"("user_id", "audiobook_id");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_audiobook_id_fkey" FOREIGN KEY ("audiobook_id") REFERENCES "audiobooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
