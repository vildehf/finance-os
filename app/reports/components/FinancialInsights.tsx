import type { FinancialInsight } from "../lib/insights";

type FinancialInsightsProps = {
  insights: FinancialInsight[];
};

// Viser de genererte finansielle innsiktene for valgt rapportperiode.
export default function FinancialInsights({
  insights,
}: FinancialInsightsProps) {
  return (
    <section className="mt-10">
      <header>
        <h2 className="text-xl font-semibold">Financial insights</h2>
        <p className="mt-1 text-sm text-gray-500">
          Key observations based on financial performance and budget data.
        </p>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-4">
        {insights.map((insight) => {
          // Velger tekstfarge ut fra hvordan innsikten er klassifisert.
          const statusClass =
            insight.type === "positive"
              ? "text-green-600"
              : insight.type === "negative"
                ? "text-red-600"
                : "text-gray-500";

          return (
            <article key={insight.title} className="rounded-lg border p-5">
              <p className={`text-xs font-medium uppercase ${statusClass}`}>
                {insight.type}
              </p>

              <h3 className="mt-2 font-semibold">{insight.title}</h3>

              <p className="mt-2 text-sm text-gray-600">{insight.message}</p>
            </article>
          );
        })}
      </section>
    </section>
  );
}
