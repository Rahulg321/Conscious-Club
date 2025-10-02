CREATE TABLE "bravo_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"description" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bravo_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "bravo_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "bravos" ADD COLUMN "categoryId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "bravos" ADD CONSTRAINT "bravos_categoryId_bravo_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."bravo_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bravos" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."bravoType";