/*
  Warnings:

  - You are about to drop the column `code` on the `product_colors` table. All the data in the column will be lost.
  - You are about to drop the column `color_name` on the `product_colors` table. All the data in the column will be lost.
  - You are about to drop the column `hex_code` on the `product_colors` table. All the data in the column will be lost.
  - You are about to drop the column `color_id` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the `product_sizes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[product_id,color_id]` on the table `product_colors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color_id` to the `product_colors` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."product_images" DROP CONSTRAINT "product_images_color_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."product_sizes" DROP CONSTRAINT "product_sizes_product_id_fkey";

-- DropIndex
DROP INDEX "public"."product_colors_code_key";

-- AlterTable
ALTER TABLE "public"."product_colors" DROP COLUMN "code",
DROP COLUMN "color_name",
DROP COLUMN "hex_code",
ADD COLUMN     "color_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."product_images" DROP COLUMN "color_id",
ADD COLUMN     "product_color_id" INTEGER;

-- DropTable
DROP TABLE "public"."product_sizes";

-- CreateTable
CREATE TABLE "public"."colors" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sizes" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "size_label" TEXT NOT NULL,
    "cm_value" DECIMAL(4,1),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_size_pivot" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_size_pivot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "colors_code_key" ON "public"."colors"("code");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_code_key" ON "public"."sizes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_size_pivot_product_id_size_id_key" ON "public"."product_size_pivot"("product_id", "size_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_colors_product_id_color_id_key" ON "public"."product_colors"("product_id", "color_id");

-- AddForeignKey
ALTER TABLE "public"."product_colors" ADD CONSTRAINT "product_colors_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "public"."colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_size_pivot" ADD CONSTRAINT "product_size_pivot_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_size_pivot" ADD CONSTRAINT "product_size_pivot_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_images" ADD CONSTRAINT "product_images_product_color_id_fkey" FOREIGN KEY ("product_color_id") REFERENCES "public"."product_colors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
