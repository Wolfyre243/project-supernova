-- CREATE TABLE "auth"."users" (
-- 	"id" uuid PRIMARY KEY NOT NULL
-- );
--> statement-breakpoint
ALTER TABLE "status" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "status" CASCADE;