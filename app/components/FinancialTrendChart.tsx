type ChartData = {
  month: string;
  revenue: number;
  expenses: number;
};

type Props = {
  data: ChartData[];
};

export default function FinancialTrendChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <section className="mt-8 rounded-xl border bg-white p-6">
        <h2 className="text-lg font-semibold">Financial trend</h2>
        <p className="mt-2 text-sm text-slate-500">
          No transaction data available.
        </p>
      </section>
    );
  }

  const width = 600;
  const height = 240;
  const left = 60;
  const right = 20;
  const top = 20;
  const bottom = 45;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const maxValue = Math.max(
    1,
    ...data.flatMap((item) => [item.revenue, item.expenses]),
  );

  const x = (index: number) =>
    left + (index / Math.max(data.length - 1, 1)) * chartWidth;

  const y = (value: number) =>
    top + chartHeight - (value / maxValue) * chartHeight;

  const createLine = (key: "revenue" | "expenses") =>
    data.map((item, index) => `${x(index)},${y(item[key])}`).join(" ");

  return (
    <section className="mt-8 rounded-xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
      {" "}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Financial trend
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Revenue and expenses over the last six available months.
        </p>
      </div>
      <div className="flex items-center gap-5 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Revenue
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500" />
          Expenses
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-4 w-full"
        role="img"
        aria-label="Line chart showing monthly revenue and expenses"
      >
        {[0, 0.5, 1].map((fraction) => {
          const value = maxValue * fraction;
          const position = y(value);

          return (
            <g key={fraction}>
              <line
                x1={left}
                y1={position}
                x2={width - right}
                y2={position}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
              />
              <text
                x={left - 10}
                y={position + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
              >
                {Math.round(value / 1000)}k
              </text>
            </g>
          );
        })}

        {data.map((item, index) => (
          <text
            key={item.month}
            x={x(index)}
            y={height - 12}
            textAnchor="middle"
            fontSize="11"
            fill="#64748b"
          >
            {new Intl.DateTimeFormat("en-GB", {
              month: "short",
              timeZone: "UTC",
            }).format(new Date(`${item.month}-01T12:00:00Z`))}
          </text>
        ))}

        <polyline
          points={createLine("revenue")}
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <polyline
          points={createLine("expenses")}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((item, index) => (
          <g key={item.month}>
            <circle cx={x(index)} cy={y(item.revenue)} r="4" fill="#2563eb" />
            <circle cx={x(index)} cy={y(item.expenses)} r="4" fill="#f43f5e" />
          </g>
        ))}
      </svg>
    </section>
  );
}
