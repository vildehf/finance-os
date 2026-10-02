type MonthData = {
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
};

type MonthlyPerformanceProps = {
  previousMonth: MonthData;
  selectedMonth: MonthData;
  changes: {
    revenue: number | null;
    expenses: number | null;
    profit: number | null;
  };
};

export default function MonthlyPerformance({
  previousMonth,
  selectedMonth,
  changes,
}: MonthlyPerformanceProps) {
  return (
    <section className="mt-10">
      <header>
        <h2 className="text-xl font-semibold">Monthly performance</h2>

        <p className="mt-1 text-sm text-gray-500">
          {previousMonth.label} compared with {selectedMonth.label}.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Previous month */}
        <article className="rounded-lg border p-5">
          <h3 className="text-sm text-gray-500">{previousMonth.label}</h3>

          <p className="mt-2 font-medium">
            Revenue: {previousMonth.revenue.toLocaleString("nb-NO")} kr
          </p>

          <p className="mt-2 font-medium">
            Expenses: {previousMonth.expenses.toLocaleString("nb-NO")} kr
          </p>

          <p className="mt-2 font-medium">
            Profit: {previousMonth.profit.toLocaleString("nb-NO")} kr
          </p>
        </article>

        {/* Selected month */}
        <article className="rounded-lg border p-5">
          <h3 className="text-sm text-gray-500">{selectedMonth.label}</h3>

          <p className="mt-2 font-medium">
            Revenue: {selectedMonth.revenue.toLocaleString("nb-NO")} kr
          </p>

          <p className="mt-1 text-sm text-green-600">
            {changes.revenue === null
              ? `No comparison available for ${previousMonth.label}`
              : `${changes.revenue.toFixed(1)}% from ${previousMonth.label}`}
          </p>

          <p className="mt-2 font-medium">
            Expenses: {selectedMonth.expenses.toLocaleString("nb-NO")} kr
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {changes.expenses === null
              ? `No comparison available for ${previousMonth.label}`
              : `${changes.expenses.toFixed(1)}% from ${previousMonth.label}`}
          </p>

          <p className="mt-2 font-medium">
            Profit: {selectedMonth.profit.toLocaleString("nb-NO")} kr
          </p>

          <p className="mt-1 text-sm text-green-600">
            {changes.profit === null
              ? `No comparison available for ${previousMonth.label}`
              : `${changes.profit.toFixed(1)}% from ${previousMonth.label}`}
          </p>
        </article>
      </div>
    </section>
  );
}
