CREATE TYPE "public"."frequency" AS ENUM('daily', 'weekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "account" (
	"account_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"is_savings" boolean DEFAULT false NOT NULL,
	"status_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budget" (
	"budget_id" uuid PRIMARY KEY NOT NULL,
	"category_id" uuid NOT NULL,
	"allocated_amount" numeric NOT NULL,
	"period" "frequency" DEFAULT 'monthly' NOT NULL,
	"description" text,
	"status_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "budget" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "category" (
	"category_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"icon" text NOT NULL,
	"color" text NOT NULL,
	"description" text,
	"status_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "category" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "expense" (
	"expense_id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"category_id" uuid,
	"amount" numeric NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "expense" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "income" (
	"income_id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"category_id" uuid,
	"amount" numeric NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "income" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "savings_goal" (
	"savings_goal_id" uuid PRIMARY KEY NOT NULL,
	"account_id" uuid NOT NULL,
	"name" text NOT NULL,
	"target_amount" numeric NOT NULL,
	"status_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "savings_goal" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "status" (
	"status_id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "status" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_goal" ADD CONSTRAINT "savings_goal_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_goal" ADD CONSTRAINT "savings_goal_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "Users can manage their own accounts" ON "account" AS PERMISSIVE FOR ALL TO "authenticated" USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));--> statement-breakpoint
CREATE POLICY "Users can manage their own budgets" ON "budget" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM category
        WHERE
          category.category_id = "budget"."category_id" AND
          category.user_id = auth.uid()
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM category
        WHERE
          category.category_id = "budget"."category_id" AND
          category.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "Users can manage their own categories" ON "category" AS PERMISSIVE FOR ALL TO "authenticated" USING (((select auth.uid()) = user_id)) WITH CHECK (((select auth.uid()) = user_id));--> statement-breakpoint
CREATE POLICY "Users can manage their own expenses" ON "expense" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "expense"."account_id" AND 
          account.user_id = auth.uid()
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "expense"."account_id" AND 
          account.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "Users can manage their own income" ON "income" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "income"."account_id" AND 
          account.user_id = auth.uid()
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "income"."account_id" AND 
          account.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "Users can manage their own savings goals" ON "savings_goal" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "savings_goal"."account_id" AND 
          account.user_id = auth.uid()
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "savings_goal"."account_id" AND 
          account.user_id = auth.uid()
      ));--> statement-breakpoint
CREATE POLICY "Enable read access for authenticated users" ON "status" AS PERMISSIVE FOR SELECT TO "authenticated", "supabase_auth_admin";--> statement-breakpoint
CREATE POLICY "Allow only supabase_admin to insert statuses" ON "status" AS PERMISSIVE FOR INSERT TO "supabase_admin", "supabase_auth_admin";--> statement-breakpoint
CREATE POLICY "Allow only supabase_admin to update statuses" ON "status" AS PERMISSIVE FOR UPDATE TO "supabase_admin", "supabase_auth_admin";