import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'assistant');
  CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"pages_find" boolean DEFAULT false,
  	"pages_create" boolean DEFAULT false,
  	"pages_update" boolean DEFAULT false,
  	"projects_find" boolean DEFAULT false,
  	"projects_create" boolean DEFAULT false,
  	"projects_update" boolean DEFAULT false,
  	"project_categories_find" boolean DEFAULT false,
  	"media_find" boolean DEFAULT false,
  	"site_settings_find" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_steps_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_steps" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_features_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_features" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_page_banner" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages_blocks_profile_columns" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_profile" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_about_tabs" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "pages_blocks_about_tabs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "pages_blocks_about" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages_blocks_contact_info" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_steps_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_steps" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_features_items" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_features" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_page_banner" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_profile_columns" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_profile" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_about_tabs" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_about_tabs" ALTER COLUMN "text" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_about" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "_pages_v_blocks_contact_info" ALTER COLUMN "heading" DROP NOT NULL;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_title" DROP NOT NULL;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug" DROP NOT NULL;
  ALTER TABLE "projects_gallery" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "cover_id" DROP NOT NULL;
  ALTER TABLE "_projects_v_version_gallery" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_title" DROP NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_slug" DROP NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_cover_id" DROP NOT NULL;
  ALTER TABLE "pages" ADD COLUMN "_status" "enum_pages_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v" ADD COLUMN "version__status" "enum__pages_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_pages_v" ADD COLUMN "latest" boolean;
  ALTER TABLE "projects" ADD COLUMN "_status" "enum_projects_status" DEFAULT 'draft';
  ALTER TABLE "_projects_v" ADD COLUMN "version__status" "enum__projects_v_version_status" DEFAULT 'draft';
  ALTER TABLE "_projects_v" ADD COLUMN "latest" boolean;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'admin' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  UPDATE "pages" SET "_status" = 'published';
  UPDATE "projects" SET "_status" = 'published';
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_mcp_api_keys" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_mcp_api_keys" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk";
  
  DROP INDEX "pages__status_idx";
  DROP INDEX "_pages_v_version_version__status_idx";
  DROP INDEX "_pages_v_latest_idx";
  DROP INDEX "projects__status_idx";
  DROP INDEX "_projects_v_version_version__status_idx";
  DROP INDEX "_projects_v_latest_idx";
  DROP INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx";
  DROP INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx";
  ALTER TABLE "pages_blocks_hero" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_steps_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_steps" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_features_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_features" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_cta" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_page_banner" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages_blocks_profile_columns" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_profile" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_about_tabs" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "pages_blocks_about_tabs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "pages_blocks_about" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages_blocks_contact_info" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "pages" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_hero" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_steps_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_steps" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_features_items" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_features" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_cta" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_page_banner" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_profile_columns" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_profile" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_about_tabs" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_about_tabs" ALTER COLUMN "text" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_about" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "_pages_v_blocks_contact_info" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_title" SET NOT NULL;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_slug" SET NOT NULL;
  ALTER TABLE "projects_gallery" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "cover_id" SET NOT NULL;
  ALTER TABLE "_projects_v_version_gallery" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_title" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_slug" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_cover_id" SET NOT NULL;
  ALTER TABLE "pages" DROP COLUMN "_status";
  ALTER TABLE "_pages_v" DROP COLUMN "version__status";
  ALTER TABLE "_pages_v" DROP COLUMN "latest";
  ALTER TABLE "projects" DROP COLUMN "_status";
  ALTER TABLE "_projects_v" DROP COLUMN "version__status";
  ALTER TABLE "_projects_v" DROP COLUMN "latest";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_mcp_api_keys_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "payload_mcp_api_keys_id";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_users_role";`)
}
