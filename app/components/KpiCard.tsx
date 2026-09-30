type KpiCardProps = {
  title: string;
  value: string;
  change: string;
};

export default function KpiCard({ title, value, change }: KpiCardProps) {
  return (
    <div className="rounded-lg border p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm">{change}</p>
    </div>
  );
}
