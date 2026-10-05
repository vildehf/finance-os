import { db } from "../db";
import KpiCard from "./components/KpiCard";
import { transactions } from "../db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

//Henter transaksjoner for en bestemt type og periode,
// og returnerer summen av beløpene
async function getTransactionTotal(
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

// Beregner prosentvis endring mellom verdier
// Returnerer 0 hvis forrige verdi er 0, slik at vi unngår deling på 0
function calculatePercentageChange(
  currentValue: number,
  previousValue: number,
) {
  if (previousValue === 0) {
    return 0;
  }

  return ((currentValue - previousValue) / previousValue) * 100;
}

export default async function Home() {
  // Henter total inntekt for september
  const revenue = await getTransactionTotal(
    "revenue",
    "2026-09-01",
    "2026-10-01",
  );

  // Henter total inntekt for august
  const previousRevenue = await getTransactionTotal(
    "revenue",
    "2026-08-01",
    "2026-09-01",
  );

  // Beregner prosentvis endring i inntekt fra august til september
  const revenueChange = calculatePercentageChange(revenue, previousRevenue);

  // Henter totale utgifter for september
  const expenses = await getTransactionTotal(
    "expense",
    "2026-09-01",
    "2026-10-01",
  );

  // Henter totale utgifter for august
  const previousExpenses = await getTransactionTotal(
    "expense",
    "2026-08-01",
    "2026-09-01",
  );

  // Beregner prosentvis endring i utgiftene fra august til september
  const expenseChange = calculatePercentageChange(expenses, previousExpenses);

  // Beregner resultat: inntekter minus utgifter
  const profit = revenue - expenses;

  // Beregner resultat for august
  const previousProfit = previousRevenue - previousExpenses;

  // Beregner prosentvis endring i resultat fra august til september
  const profitChange = calculatePercentageChange(profit, previousProfit);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="text-center md:text-left">
        <p className="text-sm font-medium text-blue-700">September 2026</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-slate-500">
          Financial performance at a glance.
        </p>
      </header>

      <section className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <KpiCard
            title="Revenue"
            value={`${revenue.toLocaleString("nb-NO")} kr`}
            change={`${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}%`}
            href="/transactions?type=revenue"
            status={
              revenueChange > 0
                ? "positive"
                : revenueChange < 0
                  ? "negative"
                  : "neutral"
            }
          />

          <KpiCard
            title="Expenses"
            value={`${expenses.toLocaleString("nb-NO")} kr`}
            change={`${expenseChange >= 0 ? "+" : ""}${expenseChange.toFixed(1)}%`}
            href="/transactions?type=expense"
            status={
              expenseChange < 0
                ? "positive"
                : expenseChange > 0
                  ? "negative"
                  : "neutral"
            }
          />

          <KpiCard
            title="Profit"
            value={`${profit.toLocaleString("nb-NO")} kr`}
            change={`${profitChange >= 0 ? "+" : ""}${profitChange.toFixed(1)}%`}
            status={
              profitChange > 0
                ? "positive"
                : profitChange < 0
                  ? "negative"
                  : "neutral"
            }
            href="/reports"
          />
        </div>
      </section>
    </main>
  );
}
