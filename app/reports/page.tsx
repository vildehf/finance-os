import { db } from "../../db";
import { transactions } from "@/db/schema";

function calculateTotal(
  transactions: { type: string; amount: string }[],
  type: "revenue" | "expense",
) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
}

export default async function ReportsPage() {
  // Henter alle transaksjoner fra databasen
  const allTransactions = await db.select().from(transactions);

  // Summerer alle inntekter
  const revenue = calculateTotal(allTransactions, "revenue");

  // Summerer alle utgifter
  const expenses = calculateTotal(allTransactions, "expense");

  // Resultat = inntekter - utgifter
  const profit = revenue - expenses;

  // Henter transaksjoner fra september
  const septemberTransactions = allTransactions.filter((transaction) =>
    transaction.date.startsWith("2026-09"),
  );

  // Henter transaksjoner fra august
  const augustTransactions = allTransactions.filter((transaction) =>
    transaction.date.startsWith("2026-08"),
  );

  // Summerer inntekter for september
  const septemberRevenue = calculateTotal(septemberTransactions, "revenue");

  // Summerer utgifter for september
  const septemberExpenses = calculateTotal(septemberTransactions, "expense");

  // Beregner resultat for september
  const septemberProfit = septemberRevenue - septemberExpenses;

  // Summerer inntekter for august
  const augustRevenue = calculateTotal(augustTransactions, "revenue");

  // Summerer utgifter for august
  const augustExpenses = calculateTotal(augustTransactions, "expense");

  // Beregner resultat for august
  const augustProfit = augustRevenue - augustExpenses;

  // Beregner prosentvis endring i inntekter fra august til september
  const revenueChange =
    ((septemberRevenue - augustRevenue) / augustRevenue) * 100;

  // Beregner prosentvis endring i utgifter fra august til september
  const expensesChange =
    ((septemberExpenses - augustExpenses) / augustExpenses) * 100;

  // Beregner prosentvis endring i resultat fra august til september
  const profitChange = ((septemberProfit - augustProfit) / augustProfit) * 100;

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-semibold">Reports</h1>

        <p className="mt-2 text-gray-500">
          Analyze company financial performance.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Revenue</p>

          <p className="mt-2 text-2xl font-semibold">
            {revenue.toLocaleString("nb-NO")} kr
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Expenses</p>

          <p className="mt-2 text-2xl font-semibold">
            {expenses.toLocaleString("nb-NO")} kr
          </p>
        </div>

        <div className="rounded-lg border p-5">
          <p className="text-sm text-gray-500">Profit</p>

          <p className="mt-2 text-2xl font-semibold">
            {profit.toLocaleString("nb-NO")} kr
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold">Monthly performance</h2>

        <p className="mt-1 text-sm text-gray-500">
          August compared with September 2026.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-5">
            <p className="text-sm text-gray-500">August</p>

            <p className="mt-2 font-medium">
              Revenue: {augustRevenue.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-2 font-medium">
              Expenses: {augustExpenses.toLocaleString("nb-NO")} kr
            </p>

            <p className="mt-2 font-medium">
              Profit: {augustProfit.toLocaleString("nb-NO")} kr
            </p>
          </div>

          <div className="rounded-lg border p-5">
            <p className="text-sm text-gray-500">September</p>

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
          </div>
        </div>
      </div>
    </div>
  );
}
