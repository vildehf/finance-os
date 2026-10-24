import { db } from "../db";
import KpiCard from "./components/KpiCard";
import { transactions } from "../db/schema";
import { and, eq, gte, lt, desc } from "drizzle-orm";
import { getTotalsByMonthAndType } from "./reports/lib/report-data";
import { getMonthlyFinancials } from "./reports/lib/report-calculations";
import FinancialTrendChart from "./components/FinancialTrendChart";

// Sørger for at dashboardet henter oppdaterte data fra databasen ved hver forespørsel.
export const dynamic = "force-dynamic";

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
  // Finn den nyeste transaksjonsdatoen i databasen
  const latestTransactions = await db
    .select({ date: transactions.date })
    .from(transactions)
    .orderBy(desc(transactions.date))
    .limit(1);

  const latestDate = latestTransactions[0]?.date;
  // Henter månedlige økonomitall til dashboardgrafen
  const totalsByMonthAndType = await getTotalsByMonthAndType();

  // Finner de seks nyeste månedene med transaksjoner
  const chartMonths = [...new Set(totalsByMonthAndType.map((row) => row.month))]
    .sort()
    .slice(-6);

  // Lager datagrunnlaget for grafen
  const chartData = chartMonths.map((month) => {
    const financials = getMonthlyFinancials(totalsByMonthAndType, month);

    return {
      month,
      revenue: financials.revenue,
      expenses: financials.expenses,
    };
  });
  // Bruk nyeste transaksjonsmåned, eller inneværende måned hvis databasen er tom
  const selectedDate = latestDate
    ? new Date(`${latestDate}T12:00:00Z`)
    : new Date();

  const year = selectedDate.getUTCFullYear();
  const month = selectedDate.getUTCMonth();

  // Første dag i valgt måned
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  // Første dag i neste måned
  const nextMonth = new Date(Date.UTC(year, month + 1, 1));
  const endDate = nextMonth.toISOString().slice(0, 10);

  // Første dag i forrige måned
  const previousMonth = new Date(Date.UTC(year, month - 1, 1));
  const previousStartDate = previousMonth.toISOString().slice(0, 10);

  // Henter inntekter for den nyeste måneden
  const revenue = await getTransactionTotal("revenue", startDate, endDate);

  // Henter inntekter for forrige måned
  const previousRevenue = await getTransactionTotal(
    "revenue",
    previousStartDate,
    startDate,
  );

  const revenueChange = calculatePercentageChange(revenue, previousRevenue);

  // Henter utgifter for den nyeste måneden
  const expenses = await getTransactionTotal("expense", startDate, endDate);

  // Henter utgifter for forrige måned
  const previousExpenses = await getTransactionTotal(
    "expense",
    previousStartDate,
    startDate,
  );

  const expenseChange = calculatePercentageChange(expenses, previousExpenses);

  // Beregner resultat og prosentvis endring
  const profit = revenue - expenses;
  const previousProfit = previousRevenue - previousExpenses;
  const profitChange = calculatePercentageChange(profit, previousProfit);

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(selectedDate);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="text-center md:text-left">
        <p className="text-sm font-medium text-blue-700">{monthLabel}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-slate-500">
          Financial performance at a glance.
        </p>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
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
      </section>

      <FinancialTrendChart data={chartData} />
    </main>
  );
}
