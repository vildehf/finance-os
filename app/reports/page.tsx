import { db } from "../../db";
import { transactions, budgets } from "@/db/schema";
import ReportBar from "../components/ReportBar";
import { eq, sql } from "drizzle-orm";
import MonthSelector from "./components/MonthSelector";
import MonthlyPerformance from "./components/MonthlyPerformance";
import BudgetVsActual from "./components/BudgetVsActual";

// Beregner endring mellom valgt måned og måneden før.
function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  // Henter totale inntekter og kostnader på tvers av alle transaksjoner.
  const totalsByType = await db
    .select({
      type: transactions.type,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .groupBy(transactions.type);
  // Henter summerte inntekter og kostnader gruppert per måned.
  const totalsByMonthAndType = await db
    .select({
      month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`,
      type: transactions.type,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`, transactions.type);
  // Lager en sortert liste over måneder som finnes i transaksjonsdataene.
  const availableMonths = [
    ...new Set(totalsByMonthAndType.map((row) => row.month)),
  ].sort();
  // Bruker nyeste tilgjengelige måned dersom URL-en ikke har valgt en måned.
  const latestMonth = availableMonths.at(-1) ?? "2026-09";
  const selectedMonth = params.month ?? latestMonth;

  // Henter budsjettet som tilhører måneden brukeren har valgt.
  const [selectedBudget] = await db
    .select()
    .from(budgets)
    .where(eq(budgets.month, `${selectedMonth}-01`))
    .limit(1);
  // Finner måneden før valgt måned for måned-til-måned-sammenligningen.
  const [year, month] = selectedMonth.split("-").map(Number);

  const previousDate = new Date(year, month - 2);

  const previousMonth = `${previousDate.getFullYear()}-${String(
    previousDate.getMonth() + 1,
  ).padStart(2, "0")}`;
  // Sjekker om forrige måned faktisk finnes i transaksjonsdataene.
  const hasPreviousMonthData = availableMonths.includes(previousMonth);

  const selectedMonthLabel = new Date(`${selectedMonth}-01`).toLocaleString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const previousMonthLabel = new Date(`${previousMonth}-01`).toLocaleString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  );

  const revenue = Number(
    totalsByType.find((row) => row.type === "revenue")?.total ?? 0,
  );

  const expenses = Number(
    totalsByType.find((row) => row.type === "expense")?.total ?? 0,
  );

  const profit = revenue - expenses;

  const selectedRevenue = Number(
    totalsByMonthAndType.find(
      (row) => row.month === selectedMonth && row.type === "revenue",
    )?.total ?? 0,
  );

  const selectedExpenses = Number(
    totalsByMonthAndType.find(
      (row) => row.month === selectedMonth && row.type === "expense",
    )?.total ?? 0,
  );

  const selectedProfit = selectedRevenue - selectedExpenses;

  // Gjør budsjettert revenue og expenses om fra PostgreSQL numeric til number.
  const budgetRevenue = Number(selectedBudget?.revenue ?? 0);
  const budgetExpenses = Number(selectedBudget?.expenses ?? 0);

  // Beregner budsjettert profit i stedet for å lagre samme informasjon i databasen.
  const budgetProfit = budgetRevenue - budgetExpenses;

  // Beregner avviket mellom faktiske tall og budsjettet.
  const revenueVariance = selectedRevenue - budgetRevenue;
  const expensesVariance = selectedExpenses - budgetExpenses;
  const profitVariance = selectedProfit - budgetProfit;

  const previousRevenue = Number(
    totalsByMonthAndType.find(
      (row) => row.month === previousMonth && row.type === "revenue",
    )?.total ?? 0,
  );

  const previousExpenses = Number(
    totalsByMonthAndType.find(
      (row) => row.month === previousMonth && row.type === "expense",
    )?.total ?? 0,
  );

  const previousProfit = previousRevenue - previousExpenses;

  // Beregner prosentvis endring fra forrige måned til valgt. måned.
  const revenueChange = calculatePercentageChange(
    selectedRevenue,
    previousRevenue,
  );

  const expensesChange = calculatePercentageChange(
    selectedExpenses,
    previousExpenses,
  );

  const profitChange = calculatePercentageChange(
    selectedProfit,
    previousProfit,
  );

  // Beregner bredden på forrige måneds revenue-stolpe relativt til valgt måned.
  const previousRevenueWidth = (previousRevenue / selectedRevenue) * 100;

  // Bruker bredden på forrige måneds exspense-stolpe relativt til valgt måned.
  const previousExpensesWidth = (previousExpenses / selectedExpenses) * 100;

  // Beregner bredden på forrige måneds profit-stolpe relativt til valgt måned.
  const previousProfitWidth = (previousProfit / selectedProfit) * 100;

  return (
    <main className="p-8">
      {/* Sideoverskrift */}
      <header>
        <h1 className="text-3xl font-semibold">Reports</h1>

        <p className="mt-2 text-gray-500">
          Analyze company financial performance.
        </p>
      </header>

      <MonthSelector
        availableMonths={availableMonths}
        selectedMonth={selectedMonth}
      />

      {/* Totaltall */}
      <section className="mt-8 grid grid-cols-3 gap-4">
        <article className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Revenue</p>

          <p className="mt-2 text-2xl font-semibold">
            {revenue.toLocaleString("nb-NO")} kr
          </p>
        </article>

        <article className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Expenses</p>

          <p className="mt-2 text-2xl font-semibold">
            {expenses.toLocaleString("nb-NO")} kr
          </p>
        </article>

        <article className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Profit</p>

          <p className="mt-2 text-2xl font-semibold">
            {profit.toLocaleString("nb-NO")} kr
          </p>
        </article>
      </section>

      {/* Månedssammenligning */}
      <MonthlyPerformance
        hasPreviousMonthData={hasPreviousMonthData}
        previousMonth={{
          label: previousMonthLabel,
          revenue: previousRevenue,
          expenses: previousExpenses,
          profit: previousProfit,
        }}
        selectedMonth={{
          label: selectedMonthLabel,
          revenue: selectedRevenue,
          expenses: selectedExpenses,
          profit: selectedProfit,
        }}
        changes={{
          revenue: revenueChange,
          expenses: expensesChange,
          profit: profitChange,
        }}
      />

      {/* Viser budsjett-sammenligning når budsjett finnes, ellers en tydelig melding. */}
      {selectedBudget ? (
        <BudgetVsActual
          monthLabel={selectedMonthLabel}
          budget={{
            revenue: budgetRevenue,
            expenses: budgetExpenses,
            profit: budgetProfit,
          }}
          actual={{
            revenue: selectedRevenue,
            expenses: selectedExpenses,
            profit: selectedProfit,
          }}
          variance={{
            revenue: revenueVariance,
            expenses: expensesVariance,
            profit: profitVariance,
          }}
        />
      ) : (
        <section className="mt-10 rounded-lg border p-5">
          <h2 className="text-xl font-semibold">Budget vs actual</h2>
          <p className="mt-2 text-sm text-gray-500">
            No budget available for {selectedMonthLabel}.
          </p>
        </section>
      )}

      {/* Finansiell visualisering */}
      <section className="mt-8">
        <h3 className="font-semibold">Financial overview</h3>

        <article className="mt-6 rounded-lg border p-5">
          <h4 className="font-medium">Revenue</h4>

          {/* Previous month revenue */}
          <ReportBar
            label={previousMonthLabel}
            amount={previousRevenue}
            width={previousRevenueWidth}
            hasData={hasPreviousMonthData}
          />

          {/* Selected month revenue */}
          <ReportBar
            label={selectedMonthLabel}
            amount={selectedRevenue}
            width={100}
          />
        </article>

        <article className="mt-6 rounded-lg border p-5">
          <h4 className="font-medium">Expenses</h4>

          <ReportBar
            label={previousMonthLabel}
            amount={previousExpenses}
            width={previousExpensesWidth}
            hasData={hasPreviousMonthData}
          />

          <ReportBar
            label={selectedMonthLabel}
            amount={selectedExpenses}
            width={100}
          />
        </article>

        <article className="mt-6 rounded-lg border p-5">
          <h4 className="font-medium">Profit</h4>

          <ReportBar
            label={previousMonthLabel}
            amount={previousProfit}
            width={previousProfitWidth}
            hasData={hasPreviousMonthData}
          />

          <ReportBar
            label={selectedMonthLabel}
            amount={selectedProfit}
            width={100}
          />
        </article>
      </section>
    </main>
  );
}
