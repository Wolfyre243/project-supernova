ALTER TABLE "user_role" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable read access for authenticated users" ON "user_role" AS PERMISSIVE FOR SELECT TO "authenticated", "supabase_admin", "supabase_auth_admin";--> statement-breakpoint
CREATE POLICY "Allow only supabase_admin to insert roles" ON "user_role" AS PERMISSIVE FOR INSERT TO "supabase_admin", "supabase_auth_admin";--> statement-breakpoint
CREATE POLICY "Allow only supabase_admin to update roles" ON "user_role" AS PERMISSIVE FOR UPDATE TO "supabase_admin";