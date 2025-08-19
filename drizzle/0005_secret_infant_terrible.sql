ALTER TABLE "roles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "roles" AS PERMISSIVE FOR SELECT TO public USING (true);