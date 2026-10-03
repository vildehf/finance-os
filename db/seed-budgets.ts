import { db } from "./index";
import { budgets } from "./schema";

async function seedBudgets() {
  await db.insert(budgets).values([
    {
      month: "2026-08-01",
      revenue: "85000",
      expenses: "60000",
    },
    {
      month: "2026-09-01",
      revenue: "100000",
      expenses: "65000",
    },
  ]);

  console.log("Budget data inserted.");
}

seedBudgets();
