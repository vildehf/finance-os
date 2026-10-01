import { db } from "../../db";
import { transactions } from "@/db/schema";
import ReportBar from "../components/ReportBar";
import { sql } from "drizzle-orm";

export default async function ReportsPage() {
  const totalsByType = await db
    .select({
      type: transactions.type,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .groupBy(transactions.type);

  const totalsByMonthAndType = await db
    .select({
      month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`,
      type: transactions.type,
      total: sql<string>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`, transactions.type);

  const revenue = Number(
    totalsByType.find((row) => row.type === "revenue")?.total ?? 0,
  );

  const expenses = Number(
    totalsByType.find((row) => row.type === "expense")?.total ?? 0,
  );

  const profit = revenue - expenses;

  const septemberRevenue = Number(
    totalsByMonthAndType.find(
      (row) => row.month === "2026-09" && row.type === "revenue",
    )?.total ?? 0,
  );

  const septemberExpenses = Number(
    totalsByMonthAndType.find(
      (row) => row.month === "2026-09" && row.type === "expense",
    )?.total ?? 0,
  );

  const septemberProfit = septemberRevenue - septemberExpenses;

  const augustRevenue = Number(
    totalsByMonthAndType.find(
      (row) => row.month === "2026-08" && row.type === "revenue",
    )?.total ?? 0,
  );

  const augustExpenses = Number(
    totalsByMonthAndType.find(
      (row) => row.month === "2026-08" && row.type === "expense",
    )?.total ?? 0,
  );

  const augustProfit = augustRevenue - augustExpenses;

  // Beregner prosentvis endring fra august til september
  const revenueChange =
    ((septemberRevenue - augustRevenue) / augustRevenue) * 100;

  const expensesChange =
    ((septemberExpenses - augustExpenses) / augustExpenses) * 100;

  const profitChange = ((septemberProfit - augustProfit) / augustProfit) * 100;

  // Bruker september som referanse for bredden på revenue-stolpen
  const augustRevenueWidth = (augustRevenue / septemberRevenue) * 100;

  // Bruker september som referanse for bredden på expense-stolpen
  const augustExpensesWidth = (augustExpenses / septemberExpenses) * 100;

  // Bruker september som referanse for bredden på profit-stolpen
  const augustProfitWidth = (augustProfit / septemberProfit) * 100;

  return (
    <main className="p-8">
      {/* Sideoverskrift */}
      <header>
        <h1 className="text-3xl font-semibold">Reports</h1>

        <p className="mt-2 text-gray-500">
          Analyze company financial performance.
        </p>
      </header>

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
      <section className="mt-10">
        <header>
          <h2 className="text-xl font-semibold">Monthly performance</h2>

          <p className="mt-1 text-sm text-gray-500">
            August compared with September 2026.
          </p>
        </header>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {/* August */}
          <article className="rounded-lg border p-5">
            <h3 className="text-sm text-gray-500">August</h3>

            <p className="mt-2 font-medium">
              Revenue: {augustRevenue.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-2 font-medium">
              Expenses: {augustExpenses.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-2 font-medium">
              Profit: {augustProfit.toLocaleString("nb-NO")} kr
            </p>
          </article>

          {/* September */}
          <article className="rounded-lg border p-5">
            <h3 className="text-sm text-gray-500">September</h3>

            <p className="mt-2 font-medium">
              Revenue: {septemberRevenue.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-1 text-sm text-green-600">
              +{revenueChange.toFixed(1)}% from August
            </p>

            <p className="mt-2 font-medium">
              Expenses: {septemberExpenses.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-1 text-sm text-gray-500">
              +{expensesChange.toFixed(1)}% from August
            </p>

            <p className="mt-2 font-medium">
              Profit: {septemberProfit.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-1 text-sm text-green-600">
              +{profitChange.toFixed(1)}% from August
            </p>
          </article>
        </div>

        {/* Finansiell visualisering */}
        <section className="mt-8">
          <h3 className="font-semibold">Financial overview</h3>

          <article className="mt-6 rounded-lg border p-5">
            <h4 className="font-medium">Revenue</h4>

            {/* August revenue */}
            <ReportBar
              label="August"
              amount={augustRevenue}
              width={augustRevenueWidth}
            />

            {/* September revenue */}
            <ReportBar
              label="September"
              amount={septemberRevenue}
              width={100}
            />
          </article>

          <article className="mt-6 rounded-lg border p-5">
            <h4 className="font-medium">Expenses</h4>

            <ReportBar
              label="August"
              amount={augustExpenses}
              width={augustExpensesWidth}
            />

            <ReportBar
              label="September"
              amount={septemberExpenses}
              width={100}
            />
          </article>

          <article className="mt-6 rounded-lg border p-5">
            <h4 className="font-medium">Profit</h4>

            <ReportBar
              label="August"
              amount={augustProfit}
              width={augustProfitWidth}
            />

            <ReportBar label="September" amount={septemberProfit} width={100} />
          </article>
        </section>
      </section>
    </main>
  );
}
