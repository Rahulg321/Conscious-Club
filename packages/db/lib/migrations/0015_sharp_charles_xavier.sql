DROP INDEX "project_comments_project_id_index";--> statement-breakpoint
DROP INDEX "project_comments_user_id_index";--> statement-breakpoint
CREATE INDEX "project_comments_project_id_index" ON "project_comments" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "project_comments_user_id_index" ON "project_comments" USING btree ("userId");