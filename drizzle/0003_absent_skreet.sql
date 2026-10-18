ALTER TABLE "transactions" ADD COLUMN "external_id" text;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "source" text;--> statement-breakpoint
CREATE UNIQUE INDEX "transactions_source_external_id_unique" ON "transactions" USING btree ("source","external_id");