CREATE TABLE "project_tags" (
	"projectId" uuid,
	"tagId" uuid,
	CONSTRAINT "project_tags_projectId_tagId_pk" PRIMARY KEY("projectId","tagId")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_projectId_project_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_tags_project_id_tag_id_unique" ON "project_tags" USING btree ("projectId","tagId");