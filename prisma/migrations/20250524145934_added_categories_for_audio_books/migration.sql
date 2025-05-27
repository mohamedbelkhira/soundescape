-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiobook_categories" (
    "id" TEXT NOT NULL,
    "audiobook_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "audiobook_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "audiobook_categories_audiobook_id_category_id_key" ON "audiobook_categories"("audiobook_id", "category_id");

-- AddForeignKey
ALTER TABLE "audiobook_categories" ADD CONSTRAINT "audiobook_categories_audiobook_id_fkey" FOREIGN KEY ("audiobook_id") REFERENCES "audiobooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiobook_categories" ADD CONSTRAINT "audiobook_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
