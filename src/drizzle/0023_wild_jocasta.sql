ALTER TABLE "transaction" ALTER COLUMN "date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "transaction" ALTER COLUMN "date" SET DEFAULT now();