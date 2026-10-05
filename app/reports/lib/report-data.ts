import { db } from "@/db";
import { budgets, transactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// Henter totale inntekter og kostnader på tvers av alle transaksjoner.
export async function getTotalsByType() {
  return db
    .select({
      type: transactions.type,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .groupBy(transactions.type);
}

// Henter summerte inntekter og kostnader gruppert per måned.
export async function getTotalsByMonthAndType() {
  return db
    .select({
      month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`,
      type: transactions.type,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`, transactions.type);
}

// Henter budsjettet som tilhører valgt rapportmåned.
export async function getBudgetByMonth(month: string) {
  const [budget] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.month, `${month}-01`))
    .limit(1);

  return budget;
}
