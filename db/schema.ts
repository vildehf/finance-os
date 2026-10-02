import { pgTable, serial, text, numeric, date } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
});

export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  month: date("month").notNull(),
  revenue: numeric("revenue").notNull(),
  expenses: numeric("expenses").notNull(),
});
