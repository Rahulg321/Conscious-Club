ALTER TABLE "challenges" ADD COLUMN "isCompleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "completedAt" timestamp;