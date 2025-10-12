ALTER TABLE "project" ADD COLUMN "isMashup" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "collaboratorId" uuid;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_collaboratorId_user_id_fk" FOREIGN KEY ("collaboratorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;