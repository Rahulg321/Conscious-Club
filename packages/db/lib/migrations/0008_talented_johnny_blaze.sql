CREATE TYPE "public"."bravoType" AS ENUM('Boss', 'Bestie', 'Buzz', 'Bold', 'Brag');--> statement-breakpoint
CREATE TABLE "bravos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"type" "bravoType" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
