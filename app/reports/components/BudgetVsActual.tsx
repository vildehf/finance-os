type BudgetVsActualProps = {
  monthLabel: string;
  budget: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  actual: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  variance: {
    revenue: number;
    expenses: number;
    profit: number;
  };
};

// Vurderer om et budsjettavvik er positivt eller negativt for resultatet.
function getVarianceStatus(
  variance: number,
  metric: "revenue" | "expenses" | "profit",
) {
  if (variance === 0) {
    return "On budget";
  }

  const isFavorable = metric === "expenses" ? variance < 0 : variance > 0;

  return isFavorable ? "Favorable" : "Unfavorable";
}

// Velger tekstfarge basert på om budsjettavviket er positivt eller negativt.
function getVarianceStatusClass(status: string) {
  if (status === "Favorable") {
    return "text-green-600";
  }

  if (status === "Unfavorable") {
    return "text-red-600";
  }

  return "text-gray-500";
}

// Viser budsjetterte tall sammenlignet med faktiske resultater for valgt måned.
export default function BudgetVsActual({
  monthLabel,
  budget,
  actual,
  variance,
}: BudgetVsActualProps) {
  // Bestemmer status for hvert avvik før verdiene vises i tabellen.
  const revenueStatus = getVarianceStatus(variance.revenue, "revenue");
  const expensesStatus = getVarianceStatus(variance.expenses, "expenses");
  const profitStatus = getVarianceStatus(variance.profit, "profit");
  // Bestemmer visuell statusfarge for hvert budsjettavvik.
  const revenueStatusClass = getVarianceStatusClass(revenueStatus);
  const expensesStatusClass = getVarianceStatusClass(expensesStatus);
  const profitStatusClass = getVarianceStatusClass(profitStatus);
  return (
    <section className="mt-10">
      <header>
        <h2 className="text-xl font-semibold">Budget vs actual</h2>
        <p className="mt-1 text-sm text-gray-500">
          Financial performance against budget for {monthLabel}.
        </p>
      </header>
      <table className="mt-6 w-full overflow-hidden rounded-lg border text-left">
        <thead className="border-b bg-gray-50 text-sm text-gray-600">
          <tr>
            <th className="p-4 font-medium">Metric</th>
            <th className="p-4 text-right font-medium">Budget</th>
            <th className="p-4 text-right font-medium">Actual</th>
            <th className="p-4 text-right font-medium">Variance</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-b">
            <th className="p-4 font-medium">Revenue</th>
            <td className="p-4 text-right">
              {budget.revenue.toLocaleString("nb-NO")} kr
            </td>
            <td className="p-4 text-right">
              {actual.revenue.toLocaleString("nb-NO")} kr
            </td>
            <td className="p-4 text-right font-medium">
              {variance.revenue.toLocaleString("nb-NO")} kr
              <p className={`mt-1 text-xs ${revenueStatusClass}`}>
                {revenueStatus}
              </p>
            </td>
          </tr>

          <tr className="border-b">
            <th className="p-4 font-medium">Expenses</th>
            <td className="p-4 text-right">
              {budget.expenses.toLocaleString("nb-NO")} kr
            </td>
            <td className="p-4 text-right">
              {actual.expenses.toLocaleString("nb-NO")} kr
            </td>
            <td className="p-4 text-right font-medium">
              {variance.expenses.toLocaleString("nb-NO")} kr
              <p className={`mt-1 text-xs ${expensesStatusClass}`}>
                {expensesStatus}
              </p>
            </td>
          </tr>

          <tr>
            <th className="p-4 font-medium">Profit</th>
            <td className="p-4 text-right">
              {budget.profit.toLocaleString("nb-NO")} kr
            </td>
            <td className="p-4 text-right">
              {actual.profit.toLocaleString("nb-NO")} kr
            </td>
            <td className="p-4 text-right font-medium">
              {variance.profit.toLocaleString("nb-NO")} kr
              <p className={`mt-1 text-xs ${profitStatusClass}`}>
                {profitStatus}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
