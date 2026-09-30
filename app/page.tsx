import { db } from "../db";
import KpiCard from "./components/KpiCard";
import { transactions } from "../db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export default async function Home() {
  // Henter alle transaksjoner som er markert som inntekt fra databasen
  const revenueTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "revenue"),
        gte(transactions.date, "2026-09-01"),
        lt(transactions.date, "2026-10-01"),
      ),
    );

  // Summerer alle inntektstransaksjonene til total revenue
  const revenue = revenueTransactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);

  // Henter inntekter fra august 2026 for å sammenligne med september
  const previousRevenueTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "revenue"),
        gte(transactions.date, "2026-08-01"),
        lt(transactions.date, "2026-09-01"),
      ),
    );

  // Summerer alle inntektene fra august
  const previousRevenue = previousRevenueTransactions.reduce(
    (total, transaction) => {
      return total + Number(transaction.amount);
    },
    0,
  );

  // Beregner prosentvis endring i inntekt fra august til september
  const revenueChange =
    previousRevenue === 0
      ? 0
      : ((revenue - previousRevenue) / previousRevenue) * 100;

  // Henter alle transaksjoner som er markert som utgift
  const expenseTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "expense"),
        gte(transactions.date, "2026-09-01"),
        lt(transactions.date, "2026-10-01"),
      ),
    );

  // Summerer alle utgiftene
  const expenses = expenseTransactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);

  // Henter utgifter fra august 2026 for å sammenligne med september
  const previousExpenseTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.type, "expense"),
        gte(transactions.date, "2026-08-01"),
        lt(transactions.date, "2026-09-01"),
      ),
    );

  // Summerer utgiftene fra august
  const previousExpenses = previousExpenseTransactions.reduce(
    (total, transaction) => {
      return total + Number(transaction.amount);
    },
    0,
  );

  // Beregner prosentvis endring i utgiftene fra august til september
  const expenseChange =
    previousExpenses === 0
      ? 0
      : ((expenses - previousExpenses) / previousExpenses) * 100;

  // Beregner resultat: inntekter minus utgifter
  const profit = revenue - expenses;

  // Beregner resultat for august
  const previousProfit = previousRevenue - previousExpenses;

  // Beregner prosentvis endring i resultat fra august til september
  const profitChange =
    previousProfit === 0
      ? 0
      : ((profit - previousProfit) / previousProfit) * 100;

  return (
    <div className="p-8">
      <div>
        <p className="text-sm text-gray-500">September 2026</p>
        <h1 className="text-3xl font-semibold">Overview</h1>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <KpiCard
          title="Revenue"
          value={`${revenue.toLocaleString("nb-NO")} kr`}
          change={`${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`}
        />

        <KpiCard
          title="Expenses"
          value={`${expenses.toLocaleString("nb-NO")} kr`}
          change={`${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`}
        />

        <KpiCard
          title="Profit"
          value={`${profit.toLocaleString("nb-NO")} kr`}
          change={`${profitChange >= 0 ? "+" : ""}${profitChange.toFixed(1)}%`}
        />
      </div>
    </div>
  );
}
