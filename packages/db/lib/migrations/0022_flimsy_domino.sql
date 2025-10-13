ALTER TABLE "project" ADD COLUMN "media" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "dedicationReason" text;--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "coverImage";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "coverVideo";--> statement-breakpoint
ALTER TABLE "project" DROP COLUMN "additionalImages";