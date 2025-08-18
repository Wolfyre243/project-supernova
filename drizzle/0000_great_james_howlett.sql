-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."gender" AS ENUM('M', 'F');--> statement-breakpoint
CREATE TABLE "status" (
	"status_id" integer PRIMARY KEY NOT NULL,
	"status_name" varchar(30) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "status" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profile" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"dob" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"gender" "gender",
	"username" text NOT NULL,
	CONSTRAINT "profile_username_key" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "profile" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE UNIQUE INDEX "status_status_name_key" ON "status" USING btree ("status_name" text_ops);--> statement-breakpoint
CREATE POLICY "Users can update their own profile" ON "profile" AS PERMISSIVE FOR UPDATE TO public USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Allow auth admin to insert profiles" ON "profile" AS PERMISSIVE FOR INSERT TO "supabase_auth_admin";--> statement-breakpoint
CREATE POLICY "Users can insert their own profile" ON "profile" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Public profiles are viewable by everyone" ON "profile" AS PERMISSIVE FOR SELECT TO public;
*/