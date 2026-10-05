import MonthSelector from "./components/MonthSelector";
import MonthlyPerformance from "./components/MonthlyPerformance";
import BudgetVsActual from "./components/BudgetVsActual";
import Forecast from "./components/Forecast";
import { calculateForecast } from "./lib/forecast";
import { generateFinancialInsights } from "./lib/insights";
import FinancialInsights from "./components/FinancialInsights";
import {
  getBudgetByMonth,
  getTotalsByMonthAndType,
  getTotalsByType,
} from "./lib/report-data";
import {
  calculateBarWidth,
  calculatePercentageChange,
  formatMonthLabel,
  getMonthlyFinancials,
  getPreviousMonth,
} from "./lib/report-calculations";
import FinancialOverview from "./components/FinancialOverview";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;

  // Henter transaksjonstall som brukes i rapportberegningene.
  const totalsByType = await getTotalsByType();
  const totalsByMonthAndType = await getTotalsByMonthAndType();

  // Lager en sortert liste over måneder som finnes i transaksjonsdataene.
  const availableMonths = [
    ...new Set(totalsByMonthAndType.map((row) => row.month)),
  ].sort();
  // Bruker nyeste tilgjengelige måned dersom URL-en ikke har valgt en måned.
  const latestMonth = availableMonths.at(-1) ?? "2026-09";
  const selectedMonth = params.month ?? latestMonth;

  // Henter budsjettet som tilhører måneden brukeren har valgt.
  const selectedBudget = await getBudgetByMonth(selectedMonth);

  // Finner måneden før valgt måned for måned-til-måned-sammenligningen.
  const previousMonth = getPreviousMonth(selectedMonth);

  // Sjekker om forrige måned faktisk finnes i transaksjonsdataene.
  const hasPreviousMonthData = availableMonths.includes(previousMonth);

  // Lager lesbare labels for valgt måned og måneden før.
  const selectedMonthLabel = formatMonthLabel(selectedMonth);
  const previousMonthLabel = formatMonthLabel(previousMonth);

  const revenue = Number(
    totalsByType.find((row) => row.type === "revenue")?.total ?? 0,
  );

  const expenses = Number(
    totalsByType.find((row) => row.type === "expense")?.total ?? 0,
  );

  const profit = revenue - expenses;

  // Henter økonomitallene for måneden brukeren har valgt.
  const selectedFinancials = getMonthlyFinancials(
    totalsByMonthAndType,
    selectedMonth,
  );

  const selectedRevenue = selectedFinancials.revenue;
  const selectedExpenses = selectedFinancials.expenses;
  const selectedProfit = selectedFinancials.profit;

  // Gjør budsjettert revenue og expenses om fra PostgreSQL numeric til number.
  const budgetRevenue = Number(selectedBudget?.revenue ?? 0);
  const budgetExpenses = Number(selectedBudget?.expenses ?? 0);

  // Beregner budsjettert profit i stedet for å lagre samme informasjon i databasen.
  const budgetProfit = budgetRevenue - budgetExpenses;

  // Beregner avviket mellom faktiske tall og budsjettet.
  const revenueVariance = selectedRevenue - budgetRevenue;
  const expensesVariance = selectedExpenses - budgetExpenses;
  const profitVariance = selectedProfit - budgetProfit;

  // Henter økonomitallene for måneden før den valgte rapportperioden.
  const previousFinancials = getMonthlyFinancials(
    totalsByMonthAndType,
    previousMonth,
  );

  const previousRevenue = previousFinancials.revenue;
  const previousExpenses = previousFinancials.expenses;
  const previousProfit = previousFinancials.profit;

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

  const previousRevenueWidth = calculateBarWidth(
    previousRevenue,
    selectedRevenue,
  );

  const previousExpensesWidth = calculateBarWidth(
    previousExpenses,
    selectedExpenses,
  );

  const previousProfitWidth = calculateBarWidth(previousProfit, selectedProfit);

  // Genererer finansielle innsikter fra rapportdataene som allerede er hentet.
  const insights = generateFinancialInsights({
    month: selectedMonth,
    revenue: selectedRevenue,
    expenses: selectedExpenses,
    profit: selectedProfit,
    previousMonth: hasPreviousMonthData ? previousMonthLabel : null,
    previousRevenue: hasPreviousMonthData ? previousRevenue : null,
    previousExpenses: hasPreviousMonthData ? previousExpenses : null,
    budgetProfit: selectedBudget ? budgetProfit : null,
  });

  // Beregner forecast for måneden etter valgt rapportperiode.
  const forecast = await calculateForecast(selectedMonth);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Sideoverskrift */}
      <header className="text-center md:text-left">
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
      <section className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
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

      {/* Viser nøkkelinnsikter basert på rapportdataene for valgt periode. */}
      <FinancialInsights insights={insights} />

      {/* Viser forecast når nok historikk finnes, ellers forklarer hvorfor den ikke kan beregnes. */}
      {forecast ? (
        <Forecast
          month={forecast.month}
          basedOn={forecast.basedOn}
          revenue={forecast.revenue}
          expenses={forecast.expenses}
          profit={forecast.profit}
        />
      ) : (
        <section className="mt-10 rounded-lg border p-5">
          <h2 className="text-xl font-semibold">Forecast unavailable</h2>
          <p className="mt-2 text-sm text-gray-500">
            At least 3 months of transaction history are required to calculate a
            forecast.
          </p>
        </section>
      )}

      {/* Viser en visuell sammenligning mellom valgt måned og måneden før. */}
      <FinancialOverview
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
        widths={{
          revenue: previousRevenueWidth,
          expenses: previousExpensesWidth,
          profit: previousProfitWidth,
        }}
      />
    </main>
  );
}
