import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('box', 'dark');
  CREATE TYPE "public"."enum_pages_blocks_projects_grid_layout" AS ENUM('squares', 'gallery');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_variant" AS ENUM('box', 'dark');
  CREATE TYPE "public"."enum__pages_v_blocks_projects_grid_layout" AS ENUM('squares', 'gallery');
  CREATE TABLE "pages_blocks_page_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_profile_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_page_banner" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_profile_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_profile" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar NOT NULL,
  	"text" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"text" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_about_badges" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_about_badges" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "pages_blocks_features" ADD COLUMN "image_width" numeric;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "variant" "enum_pages_blocks_cta_variant" DEFAULT 'box';
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "background_id" integer;
  ALTER TABLE "pages_blocks_projects_grid" ADD COLUMN "layout" "enum_pages_blocks_projects_grid_layout" DEFAULT 'squares';
  ALTER TABLE "_pages_v_blocks_features" ADD COLUMN "image_width" numeric;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "variant" "enum__pages_v_blocks_cta_variant" DEFAULT 'box';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "background_id" integer;
  ALTER TABLE "_pages_v_blocks_projects_grid" ADD COLUMN "layout" "enum__pages_v_blocks_projects_grid_layout" DEFAULT 'squares';
  ALTER TABLE "site_settings" ADD COLUMN "content_version" numeric;
  ALTER TABLE "pages_blocks_page_banner" ADD CONSTRAINT "pages_blocks_page_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_profile_columns" ADD CONSTRAINT "pages_blocks_profile_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_profile" ADD CONSTRAINT "pages_blocks_profile_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_profile" ADD CONSTRAINT "pages_blocks_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_tabs" ADD CONSTRAINT "pages_blocks_about_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_page_banner" ADD CONSTRAINT "_pages_v_blocks_page_banner_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_profile_columns" ADD CONSTRAINT "_pages_v_blocks_profile_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_profile" ADD CONSTRAINT "_pages_v_blocks_profile_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_profile" ADD CONSTRAINT "_pages_v_blocks_profile_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_tabs" ADD CONSTRAINT "_pages_v_blocks_about_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_page_banner_order_idx" ON "pages_blocks_page_banner" USING btree ("_order");
  CREATE INDEX "pages_blocks_page_banner_parent_id_idx" ON "pages_blocks_page_banner" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_page_banner_path_idx" ON "pages_blocks_page_banner" USING btree ("_path");
  CREATE INDEX "pages_blocks_profile_columns_order_idx" ON "pages_blocks_profile_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_profile_columns_parent_id_idx" ON "pages_blocks_profile_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_profile_order_idx" ON "pages_blocks_profile" USING btree ("_order");
  CREATE INDEX "pages_blocks_profile_parent_id_idx" ON "pages_blocks_profile" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_profile_path_idx" ON "pages_blocks_profile" USING btree ("_path");
  CREATE INDEX "pages_blocks_profile_image_idx" ON "pages_blocks_profile" USING btree ("image_id");
  CREATE INDEX "pages_blocks_about_tabs_order_idx" ON "pages_blocks_about_tabs" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_tabs_parent_id_idx" ON "pages_blocks_about_tabs" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_banner_order_idx" ON "_pages_v_blocks_page_banner" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_page_banner_parent_id_idx" ON "_pages_v_blocks_page_banner" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_page_banner_path_idx" ON "_pages_v_blocks_page_banner" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_profile_columns_order_idx" ON "_pages_v_blocks_profile_columns" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_profile_columns_parent_id_idx" ON "_pages_v_blocks_profile_columns" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_profile_order_idx" ON "_pages_v_blocks_profile" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_profile_parent_id_idx" ON "_pages_v_blocks_profile" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_profile_path_idx" ON "_pages_v_blocks_profile" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_profile_image_idx" ON "_pages_v_blocks_profile" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_about_tabs_order_idx" ON "_pages_v_blocks_about_tabs" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_tabs_parent_id_idx" ON "_pages_v_blocks_about_tabs" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_background_id_media_id_fk" FOREIGN KEY ("background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_background_idx" ON "pages_blocks_cta" USING btree ("background_id");
  CREATE INDEX "_pages_v_blocks_cta_background_idx" ON "_pages_v_blocks_cta" USING btree ("background_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_page_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_profile_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_profile" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_tabs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_page_banner" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_profile_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_profile" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_tabs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_page_banner" CASCADE;
  DROP TABLE "pages_blocks_profile_columns" CASCADE;
  DROP TABLE "pages_blocks_profile" CASCADE;
  DROP TABLE "pages_blocks_about_tabs" CASCADE;
  DROP TABLE "_pages_v_blocks_page_banner" CASCADE;
  DROP TABLE "_pages_v_blocks_profile_columns" CASCADE;
  DROP TABLE "_pages_v_blocks_profile" CASCADE;
  DROP TABLE "_pages_v_blocks_about_tabs" CASCADE;
  ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_background_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta" DROP CONSTRAINT "_pages_v_blocks_cta_background_id_media_id_fk";
  
  DROP INDEX "pages_blocks_cta_background_idx";
  DROP INDEX "_pages_v_blocks_cta_background_idx";
  ALTER TABLE "pages_blocks_about_badges" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_about_badges" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "pages_blocks_features" DROP COLUMN "image_width";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "background_id";
  ALTER TABLE "pages_blocks_projects_grid" DROP COLUMN "layout";
  ALTER TABLE "_pages_v_blocks_features" DROP COLUMN "image_width";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "background_id";
  ALTER TABLE "_pages_v_blocks_projects_grid" DROP COLUMN "layout";
  ALTER TABLE "site_settings" DROP COLUMN "content_version";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_projects_grid_layout";
  DROP TYPE "public"."enum__pages_v_blocks_cta_variant";
  DROP TYPE "public"."enum__pages_v_blocks_projects_grid_layout";`)
}
