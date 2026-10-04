export type FinancialInsight = {
  type: "positive" | "negative" | "neutral";
  title: string;
  message: string;
};

export type InsightInput = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  previousMonth: string | null;
  previousRevenue: number | null;
  previousExpenses: number | null;
  budgetProfit: number | null;
};

// Beregner prosentvis endring mellom en tidligere og en nåværende verdi.
function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
}

// Lager en innsikt om hvordan inntektene har utviklet seg fra forrige måned.
function createRevenueInsight(input: InsightInput): FinancialInsight | null {
  if (input.previousRevenue === null || input.previousMonth === null) {
    return null;
  }

  const percentageChange = calculatePercentageChange(
    input.revenue,
    input.previousRevenue,
  );

  if (percentageChange === null) {
    return null;
  }

  if (percentageChange > 0) {
    return {
      type: "positive",
      title: "Revenue growth",
      message: `Revenue increased ${percentageChange.toFixed(1)}% compared with ${input.previousMonth}.`,
    };
  }

  if (percentageChange < 0) {
    return {
      type: "negative",
      title: "Revenue decline",
      message: `Revenue decreased ${Math.abs(percentageChange).toFixed(1)}% compared with ${input.previousMonth}.`,
    };
  }

  return {
    type: "neutral",
    title: "Stable revenue",
    message: `Revenue was unchanged compared with ${input.previousMonth}.`,
  };
}

// Lager en innsikt om kostnadsutviklingen sammenlignet med inntektsutviklingen.
function createExpenseInsight(input: InsightInput): FinancialInsight | null {
  if (input.previousRevenue === null || input.previousExpenses === null) {
    return null;
  }

  const revenueChange = calculatePercentageChange(
    input.revenue,
    input.previousRevenue,
  );

  const expenseChange = calculatePercentageChange(
    input.expenses,
    input.previousExpenses,
  );

  if (revenueChange === null || expenseChange === null) {
    return null;
  }

  // Lager riktig beskrivelse av kostnadsendringen for både økning og nedgang.
  const expenseDirection =
    expenseChange > 0
      ? `increased ${expenseChange.toFixed(1)}%`
      : expenseChange < 0
        ? `decreased ${Math.abs(expenseChange).toFixed(1)}%`
        : "was unchanged";

  // Lager riktig beskrivelse av inntektsendringen for både økning og nedgang.
  const revenueDirection =
    revenueChange > 0
      ? `revenue increased ${revenueChange.toFixed(1)}%`
      : revenueChange < 0
        ? `revenue decreased ${Math.abs(revenueChange).toFixed(1)}%`
        : "revenue was unchanged";

  if (revenueChange <= 0) {
    return {
      type: expenseChange > 0 ? "negative" : "neutral",
      title: "Cost development",
      message: `Expenses ${expenseDirection}, while ${revenueDirection}.`,
    };
  }
  if (expenseChange < revenueChange) {
    return {
      type: "positive",
      title: "Cost development",
      message: `Expenses ${expenseDirection}, slower than revenue growth of ${revenueChange.toFixed(1)}%.`,
    };
  }

  if (expenseChange > revenueChange) {
    return {
      type: "negative",
      title: "Cost development",
      message: `Expenses ${expenseDirection}, faster than revenue growth of ${revenueChange.toFixed(1)}%.`,
    };
  }

  return {
    type: "neutral",
    title: "Cost development",
    message: "Expenses and revenue changed at the same rate.",
  };
}

// Lager en innsikt om faktisk resultat sammenlignet med budsjettert resultat.
function createProfitBudgetInsight(
  input: InsightInput,
): FinancialInsight | null {
  if (input.budgetProfit === null) {
    return null;
  }

  const variance = input.profit - input.budgetProfit;

  if (variance > 0) {
    return {
      type: "positive",
      title: "Profit above budget",
      message: `Profit is ${variance.toLocaleString("nb-NO")} kr above budget.`,
    };
  }

  if (variance < 0) {
    return {
      type: "negative",
      title: "Profit below budget",
      message: `Profit is ${Math.abs(variance).toLocaleString("nb-NO")} kr below budget.`,
    };
  }

  return {
    type: "neutral",
    title: "Profit on budget",
    message: "Profit is exactly on budget.",
  };
}

// Samler alle tilgjengelige finansielle innsikter for den valgte perioden.
export function generateFinancialInsights(
  input: InsightInput,
): FinancialInsight[] {
  const insights = [
    createRevenueInsight(input),
    createExpenseInsight(input),
    createProfitBudgetInsight(input),
  ];

  return insights.filter(
    (insight): insight is FinancialInsight => insight !== null,
  );
}
