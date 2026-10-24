import { db } from "./index";
import { budgets } from "./schema";
import { eq } from "drizzle-orm";

async function seedBudgets() {
  // Demobudsjetter for månedene som brukes i FinanceOS.
  const demoBudgets = [
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
    {
      month: "2026-10-01",
      revenue: "55000",
      expenses: "25000",
    },
  ];

  // Legger bare inn budsjettet dersom måneden ikke finnes fra før.
  for (const budget of demoBudgets) {
    const [existingBudget] = await db
      .select({ id: budgets.id })
      .from(budgets)
      .where(eq(budgets.month, budget.month))
      .limit(1);

    if (!existingBudget) {
      await db.insert(budgets).values(budget);
      console.log(`Inserted budget for ${budget.month}`);
    } else {
      console.log(`Skipped existing budget for ${budget.month}`);
    }
  }
}

seedBudgets();
