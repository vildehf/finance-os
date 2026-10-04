import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc, sql, lt } from "drizzle-orm";

// Henter summerte inntekter og kostnader per måned for forecast-beregningen.
export async function getRecentMonthlyTotals(selectedMonth: string, limit = 3) {
  // Finner første dag i måneden etter valgt måned for å avgrense historiske data.
  const [year, month] = selectedMonth.split("-").map(Number);
  const nextMonthDate = new Date(year, month, 1);

  const nextMonth = `${nextMonthDate.getFullYear()}-${String(
    nextMonthDate.getMonth() + 1,
  ).padStart(2, "0")}-01`;
  return db
    .select({
      month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`,
      revenue: sql<number>`
        SUM(CASE WHEN ${transactions.type} = 'revenue'
        THEN ${transactions.amount} ELSE 0 END)
      `,
      expenses: sql<number>`
        SUM(CASE WHEN ${transactions.type} = 'expense'
        THEN ${transactions.amount} ELSE 0 END)
      `,
    })
    .from(transactions)
    .where(lt(transactions.date, nextMonth))
    .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`)
    .orderBy(desc(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`))
    .limit(limit);
}
