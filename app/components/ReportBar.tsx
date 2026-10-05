type ReportBarProps = {
  label: string;
  amount: number;
  width: number;
  hasData?: boolean;
  variant?: "previous" | "selected";
};

export default function ReportBar({
  label,
  amount,
  width,
  hasData = true,
  variant = "previous",
}: ReportBarProps) {
  // Velger stolpefarge basert på hvilken periode som vises.
  const barClass = variant === "selected" ? "bg-blue-700" : "bg-slate-300";

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">
        {hasData
          ? `${label} — ${amount.toLocaleString("nb-NO")} kr`
          : `${label} — No data available`}
      </p>

      {hasData && (
        <div className="mt-2 h-3 w-full rounded-full bg-slate-100">
          <div
            className={`h-3 rounded-full ${barClass}`}
            style={{ width: `${width}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
