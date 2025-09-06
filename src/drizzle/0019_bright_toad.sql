ALTER TABLE "account" DROP CONSTRAINT "account_user_id_fkey";
--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_status_id_status_status_id_fk";
--> statement-breakpoint
ALTER TABLE "budget" DROP CONSTRAINT "budget_category_id_category_category_id_fk";
--> statement-breakpoint
ALTER TABLE "budget" DROP CONSTRAINT "budget_status_id_status_status_id_fk";
--> statement-breakpoint
ALTER TABLE "category" DROP CONSTRAINT "category_status_id_status_status_id_fk";
--> statement-breakpoint
ALTER TABLE "expense" DROP CONSTRAINT "expense_account_id_account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "expense" DROP CONSTRAINT "expense_category_id_category_category_id_fk";
--> statement-breakpoint
ALTER TABLE "income" DROP CONSTRAINT "income_account_id_account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "income" DROP CONSTRAINT "income_category_id_category_category_id_fk";
--> statement-breakpoint
ALTER TABLE "savings_goal" DROP CONSTRAINT "savings_goal_account_id_account_account_id_fk";
--> statement-breakpoint
ALTER TABLE "savings_goal" DROP CONSTRAINT "savings_goal_status_id_status_status_id_fk";
--> statement-breakpoint
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_role_id_roles_role_id_fk";
--> statement-breakpoint
ALTER TABLE "user_role" DROP CONSTRAINT "user_role_user_id_profile_user_id_fk";
--> statement-breakpoint
ALTER TABLE "expense" ADD COLUMN "status_id" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "income" ADD COLUMN "status_id" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "budget" ADD CONSTRAINT "budget_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savings_goal" ADD CONSTRAINT "savings_goal_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "savings_goal" ADD CONSTRAINT "savings_goal_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_role_id_roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("role_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_role" ADD CONSTRAINT "user_role_user_id_profile_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profile"("user_id") ON DELETE cascade ON UPDATE cascade;