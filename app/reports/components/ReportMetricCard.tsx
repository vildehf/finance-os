import Link from "next/link";

type ReportMetricCardProps = {
  label: string;
  amount: number;
  href?: string;
};

// Viser et nøkkeltall med valgfri lenke til tilhørende transaksjoner.
export default function ReportMetricCard({
  label,
  amount,
  href,
}: ReportMetricCardProps) {
  const content = (
    <>
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-2xl font-semibold text-slate-900">
        {amount.toLocaleString("nb-NO")} kr
      </p>

      {href && (
        <p className="mt-2 text-xs font-medium text-blue-700">
          View transactions →
        </p>
      )}
    </>
  );

  return (
    <article className="rounded-lg border bg-white">
      {href ? (
        <Link
          href={href}
          className="block rounded-lg p-5 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          {content}
        </Link>
      ) : (
        <section className="p-5">{content}</section>
      )}
    </article>
  );
}
