CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."userType" AS ENUM('explorer', 'creator', 'organizer');--> statement-breakpoint
CREATE TABLE "project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"link" text NOT NULL,
	"description" text NOT NULL,
	"coverImage" text NOT NULL,
	"logoImage" text,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "company" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "type" "userType";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dateOfBirth" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "gender" "gender";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "socialUrl" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "location" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;