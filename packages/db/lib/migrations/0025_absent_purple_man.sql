CREATE TABLE "challenge_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challengeId" uuid NOT NULL,
	"caption" text NOT NULL,
	"media" text[] NOT NULL,
	"userId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(64) NOT NULL,
	"slug" varchar(64) NOT NULL,
	"description" text,
	"bannerImage" text NOT NULL,
	"deadline" timestamp NOT NULL,
	"reward" text,
	"prizePool" integer DEFAULT 0 NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"participantsCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "challenges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "challenge_entries" ADD CONSTRAINT "challenge_entries_challengeId_challenges_id_fk" FOREIGN KEY ("challengeId") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_entries" ADD CONSTRAINT "challenge_entries_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "challenge_entries_challenge_user_unique" ON "challenge_entries" USING btree ("challengeId","userId");--> statement-breakpoint
CREATE INDEX "challenge_entries_challenge_id_index" ON "challenge_entries" USING btree ("challengeId");--> statement-breakpoint
CREATE INDEX "challenge_entries_user_id_index" ON "challenge_entries" USING btree ("userId");