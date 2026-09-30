import { db } from "../db";
import KpiCard from "./components/KpiCard";
import { transactions } from "../db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  // Henter alle transaksjoner som er markert som inntekt fra databasen
  const revenueTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.type, "revenue"));

  // Summerer alle inntektstransaksjonene til total revenue
  const revenue = revenueTransactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);
  // Henter alle transaksjoner som er markert som utgift
  const expenseTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.type, "expense"));
  // Summerer alle utgiftene
  const expenses = expenseTransactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);
  // Beregner resultat: inntekter minus utgifter
  const profit = revenue - expenses;

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
          change="+7.2%"
        />

        <KpiCard
          title="Expenses"
          value={`${expenses.toLocaleString("nb-NO")} kr`}
          change="+3.1%"
        />

        <KpiCard
          title="Profit"
          value={`${profit.toLocaleString("nb-NO")} kr`}
          change="+15.3%"
        />
      </div>
    </div>
  );
}
