import { db } from "@/db";
import { budgets, transactions } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";

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

// Henter totale utgifter per kategori for valgt rapportmåned.
export async function getExpensesByCategory(month: string) {
  const startDate = `${month}-01`;

  // Finner første dag i neste måned som øvre datogrense.
  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1));
  const endDate = nextMonth.toISOString().slice(0, 10);

  return db
    .select({
      category: transactions.category,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "expense"),
        gte(transactions.date, startDate),
        lt(transactions.date, endDate),
      ),
    )
    .groupBy(transactions.category)
    .orderBy(sql`SUM(${transactions.amount}) DESC`);
}
