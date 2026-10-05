import Link from "next/link";

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  href?: string;
  status: "positive" | "negative" | "neutral";
};

export default function KpiCard({
  title,
  value,
  change,
  href,
  status,
}: KpiCardProps) {
  // Velger farge på endringstallet basert på økonomisk status.
  const statusClass =
    status === "positive"
      ? "text-green-600"
      : status === "negative"
        ? "text-red-600"
        : "text-gray-500";

  const card = (
    <article
      className={`h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${
        href
          ? "cursor-pointer transition hover:border-blue-200 hover:bg-blue-50/40"
          : ""
      }`}
    >
      <p className="text-sm font-medium text-blue-700">{title}</p>{" "}
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className={`mt-2 text-sm font-medium ${statusClass}`}>{change}</p>{" "}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {card}
      </Link>
    );
  }
  return card;
}
