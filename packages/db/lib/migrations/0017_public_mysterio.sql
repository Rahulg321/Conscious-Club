CREATE TABLE "blog_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_categories_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_post_tags" (
	"postId" uuid NOT NULL,
	"tagId" uuid NOT NULL,
	CONSTRAINT "blog_post_tags_postId_tagId_pk" PRIMARY KEY("postId","tagId")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"metaTitle" varchar(200),
	"metaDescription" text,
	"metaKeywords" text,
	"canonicalUrl" text,
	"featuredImage" text,
	"featuredImageAlt" text,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"isPublished" boolean DEFAULT false NOT NULL,
	"categoryId" uuid,
	"readingTime" integer,
	"wordCount" integer,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "blog_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"slug" varchar(50) NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_tags_name_unique" UNIQUE("name"),
	CONSTRAINT "blog_tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_postId_blog_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_post_tags" ADD CONSTRAINT "blog_post_tags_tagId_blog_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "public"."blog_tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_categoryId_blog_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blog_posts_status_index" ON "blog_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "blog_posts_published_index" ON "blog_posts" USING btree ("isPublished");--> statement-breakpoint
CREATE INDEX "blog_posts_published_at_index" ON "blog_posts" USING btree ("publishedAt");--> statement-breakpoint
CREATE INDEX "blog_posts_category_index" ON "blog_posts" USING btree ("categoryId");