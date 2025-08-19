ALTER POLICY "Enable read access for all users" ON "roles" RENAME TO "Enable read access for authenticated users";--> statement-breakpoint
CREATE POLICY "Allow only supabase_admin to insert roles" ON "roles" AS PERMISSIVE FOR INSERT TO "supabase_admin";--> statement-breakpoint
CREATE POLICY "Allow only supabase_admin to update roles" ON "roles" AS PERMISSIVE FOR UPDATE TO "supabase_admin";