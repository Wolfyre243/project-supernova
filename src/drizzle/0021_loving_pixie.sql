CREATE TABLE "transaction" (
	"transaction_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"notes" text,
	"status_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "transaction" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP POLICY "Users can manage their own expenses" ON "expense" CASCADE;--> statement-breakpoint
DROP TABLE "expense" CASCADE;--> statement-breakpoint
DROP POLICY "Users can manage their own income" ON "income" CASCADE;--> statement-breakpoint
DROP TABLE "income" CASCADE;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_account_id_account_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("account_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_category_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("category_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_status_id_status_status_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."status"("status_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE POLICY "Users can manage their own transactions" ON "transaction" AS PERMISSIVE FOR ALL TO "authenticated" USING (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "transaction"."account_id" AND 
          account.user_id = auth.uid()
      )) WITH CHECK (EXISTS (
        SELECT 1 FROM account 
        WHERE 
          account.account_id = "transaction"."account_id" AND 
          account.user_id = auth.uid()
      ));