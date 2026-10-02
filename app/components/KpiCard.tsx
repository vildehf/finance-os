import Link from "next/link";

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  href?: string;
};

export default function KpiCard({ title, value, change, href }: KpiCardProps) {
  const card = (
    <article
      className={`rounded-lg border p-5 ${
        href ? "cursor-pointer transition hover:bg-gray-50" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-2 text-sm">{change}</p>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}
