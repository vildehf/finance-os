type ReportBarProps = {
  label: string;
  amount: number;
  width: number;
};

export default function ReportBar({ label, amount, width }: ReportBarProps) {
  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">
        {label} - {amount.toLocaleString("nb-NO")} kr
      </p>

      <div className="mt-2 h-3 w-full rounded-full bg-gray-100">
        <div
          className="h-3 rounded-full bg-gray-700"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}
