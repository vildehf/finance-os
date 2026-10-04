import { and, gte, lt } from "drizzle-orm";
import { db } from "./index";
import { transactions } from "./schema";

// Legger inn realistiske testtransaksjoner som brukes i rapportering og forecast.
export async function seedTransactions() {
  // Fjerner eksisterende testdata for seed-perioden før dataene legges inn på nytt.
  await db
    .delete(transactions)
    .where(
      and(
        gte(transactions.date, "2026-06-01"),
        lt(transactions.date, "2026-08-01"),
      ),
    );
  const insertedTransactions = await db.insert(transactions).values([
    {
      date: "2026-06-03",
      description: "Website project - Vest AS",
      amount: "32000",
      category: "Sales",
      type: "revenue",
    },
    {
      date: "2026-06-08",
      description: "Subscription - Nord AS",
      amount: "22000",
      category: "Sales",
      type: "revenue",
    },
    {
      date: "2026-06-11",
      description: "Employee salaries",
      amount: "38000",
      category: "Payroll",
      type: "expense",
    },
    {
      date: "2026-06-15",
      description: "Cloud hosting",
      amount: "5000",
      category: "Software",
      type: "expense",
    },
    {
      date: "2026-06-18",
      description: "Office rent",
      amount: "12000",
      category: "Office",
      type: "expense",
    },
    {
      date: "2026-06-23",
      description: "Consulting - Kyst AS",
      amount: "24000",
      category: "Sales",
      type: "revenue",
    },
    {
      date: "2026-07-03",
      description: "Website project - Sør AS",
      amount: "34000",
      category: "Sales",
      type: "revenue",
    },
    {
      date: "2026-07-07",
      description: "Subscription - Fjell AS",
      amount: "25000",
      category: "Sales",
      type: "revenue",
    },
    {
      date: "2026-07-11",
      description: "Employee salaries",
      amount: "39000",
      category: "Payroll",
      type: "expense",
    },
    {
      date: "2026-07-14",
      description: "Cloud hosting",
      amount: "5500",
      category: "Software",
      type: "expense",
    },
    {
      date: "2026-07-18",
      description: "Office rent",
      amount: "12000",
      category: "Office",
      type: "expense",
    },
    {
      date: "2026-07-22",
      description: "Consulting - Hav AS",
      amount: "25000",
      category: "Sales",
      type: "revenue",
    },
  ]);

  console.log(`Inserted ${insertedTransactions.count} transactions.`);
}
