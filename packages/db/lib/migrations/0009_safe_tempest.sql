ALTER TABLE "bravos" ADD COLUMN "slug" varchar(64) NOT NULL;--> statement-breakpoint
ALTER TABLE "bravos" ADD CONSTRAINT "bravos_slug_unique" UNIQUE("slug");