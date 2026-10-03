CREATE TABLE "budgets" (
	"id" serial PRIMARY KEY NOT NULL,
	"month" date NOT NULL,
	"revenue" numeric NOT NULL,
	"expenses" numeric NOT NULL
);
