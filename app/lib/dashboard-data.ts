import { db } from "@/db";
import { transactions } from "@/db/schema";
import { and, eq, gte, lt, desc } from "drizzle-orm";

// Henter summen av transaksjoner for en bestemt type og periode.
export async function getTransactionTotal(
  type: "revenue" | "expense",
  startDate: string,
  endDate: string,
) {
  const result = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, type),
        gte(transactions.date, startDate),
        lt(transactions.date, endDate),
      ),
    );

  return result.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);
}

// Henter datoen til den nyeste transaksjonen i databasen.
export async function getLatestTransactionDate() {
  const [latestTransaction] = await db
    .select({ date: transactions.date })
    .from(transactions)
    .orderBy(desc(transactions.date))
    .limit(1);

  return latestTransaction?.date;
}

// Henter inntekter, utgifter og resultat for valgt måned og måneden før.
export async function getDashboardKpis(
  startDate: string,
  endDate: string,
  previousStartDate: string,
) {
  const [revenue, previousRevenue, expenses, previousExpenses] =
    await Promise.all([
      getTransactionTotal("revenue", startDate, endDate),
      getTransactionTotal("revenue", previousStartDate, startDate),
      getTransactionTotal("expense", startDate, endDate),
      getTransactionTotal("expense", previousStartDate, startDate),
    ]);

  return {
    revenue,
    previousRevenue,
    expenses,
    previousExpenses,
    profit: revenue - expenses,
    previousProfit: previousRevenue - previousExpenses,
  };
}
