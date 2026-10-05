import Link from "next/link";

type MonthSelectorProps = {
  availableMonths: string[];
  selectedMonth: string;
};

export default function MonthSelector({
  availableMonths,
  selectedMonth,
}: MonthSelectorProps) {
  return (
    <nav className="mt-6 flex gap-2" aria-label="Select report month">
      {availableMonths.map((month) => {
        const monthLabel = new Date(`${month}-01`).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });

        return (
          <Link
            key={month}
            href={`/reports?month=${month}`}
            className={`rounded-md border px-3 py-2 text-sm transition-colors ${
              selectedMonth === month
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
            }`}
          >
            {monthLabel}
          </Link>
        );
      })}
    </nav>
  );
}
