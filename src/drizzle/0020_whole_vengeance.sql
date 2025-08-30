ALTER TABLE "account" ALTER COLUMN "account_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "budget" ALTER COLUMN "budget_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "category" ALTER COLUMN "category_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "expense" ALTER COLUMN "expense_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "income" ALTER COLUMN "income_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "savings_goal" ALTER COLUMN "savings_goal_id" SET DEFAULT gen_random_uuid();