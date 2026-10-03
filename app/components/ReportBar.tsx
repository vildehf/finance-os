type ReportBarProps = {
  label: string;
  amount: number;
  width: number;
  hasData?: boolean;
};

export default function ReportBar({
  label,
  amount,
  width,
  hasData = true,
}: ReportBarProps) {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">
        {hasData
          ? `${label} — ${amount.toLocaleString("nb-NO")} kr`
          : `${label} — No data available`}
      </p>

      {hasData && (
        <div className="mt-2 h-3 w-full rounded-full bg-gray-100">
          <div
            className="h-3 rounded-full bg-gray-700"
            style={{ width: `${width}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
