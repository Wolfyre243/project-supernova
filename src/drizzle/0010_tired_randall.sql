ALTER POLICY "Enable read access for authenticated users" ON "roles" TO authenticated,supabase_admin,supabase_auth_admin;--> statement-breakpoint
ALTER POLICY "Allow only supabase_admin to insert roles" ON "roles" TO supabase_admin,supabase_auth_admin;--> statement-breakpoint
ALTER POLICY "Allow only supabase_admin to update roles" ON "roles" TO supabase_admin,supabase_auth_admin;--> statement-breakpoint
ALTER POLICY "Allow only supabase_admin to update roles" ON "user_role" TO supabase_admin,supabase_auth_admin;