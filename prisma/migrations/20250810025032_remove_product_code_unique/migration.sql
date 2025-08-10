-- DropIndex
DROP INDEX "public"."products_code_key";

-- CreateTable
CREATE TABLE "public"."size_templates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "size_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."size_template_items" (
    "id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "size_id" INTEGER NOT NULL,
    "cm_value" DECIMAL(4,1) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "size_template_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "size_templates_name_key" ON "public"."size_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "size_template_items_template_id_size_id_key" ON "public"."size_template_items"("template_id", "size_id");

-- AddForeignKey
ALTER TABLE "public"."size_template_items" ADD CONSTRAINT "size_template_items_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."size_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."size_template_items" ADD CONSTRAINT "size_template_items_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
