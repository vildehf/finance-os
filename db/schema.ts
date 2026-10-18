import {
  pgTable,
  serial,
  text,
  numeric,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(),
    description: text("description").notNull(),
    amount: numeric("amount").notNull(),
    category: text("category").notNull(),
    type: text("type").notNull(),
    // Identifiserer transaksjoner importert fra eksterne systemer.
    externalId: text("external_id"),
    source: text("source"),
  },
  (table) => [
    uniqueIndex("transactions_source_external_id_unique").on(
      table.source,
      table.externalId,
    ),
  ],
);

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  revenue: numeric("revenue").notNull(),
  expenses: numeric("expenses").notNull(),
});
