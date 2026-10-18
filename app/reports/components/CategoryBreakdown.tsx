type CategoryExpense = {
  category: string;
  total: number;
};

type CategoryBreakdownProps = {
  expenses: CategoryExpense[];
};

// Viser hvordan månedens utgifter fordeler seg mellom kategorier.
export default function CategoryBreakdown({
  expenses,
}: CategoryBreakdownProps) {
  // Bruker største utgiftskategori som grunnlag for stolpebreddene.
  const maxExpense = Math.max(...expenses.map((item) => item.total), 0);

  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">Expenses by category</h2>

      <p className="mt-2 text-sm text-slate-500">
        See how expenses are distributed across categories.
      </p>

      {expenses.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">
          No expense data available for this month.
        </p>
      ) : (
        <ul className="mt-6 space-y-5">
          {expenses.map((item) => {
            const width = maxExpense > 0 ? (item.total / maxExpense) * 100 : 0;

            return (
              <li key={item.category}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-700">
                    {item.category}
                  </span>

                  <span className="text-sm font-semibold text-slate-900">
                    {item.total.toLocaleString("nb-NO")} kr
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-700"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
