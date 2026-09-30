CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"date" date NOT NULL,
	"desription" text NOT NULL,
	"amount" numeric NOT NULL,
	"category" text NOT NULL,
	"type" text NOT NULL
);
