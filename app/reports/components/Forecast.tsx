type ForecastProps = {
  month: string;
  basedOn: string[];
  revenue: number;
  expenses: number;
  profit: number;
};

// Gjør en YYYY-MM-verdi om til et lesbart månedsnavn.
function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Viser forecasten og forklarer hvilket historisk datagrunnlag den bygger på.
export default function Forecast({
  month,
  basedOn,
  revenue,
  expenses,
  profit,
}: ForecastProps) {
  const forecastMonthLabel = formatMonth(month);
  const firstSourceMonth = formatMonth(basedOn[0]);
  const lastSourceMonth = formatMonth(basedOn[basedOn.length - 1]);

  return (
    <section className="mt-10">
      <header>
        <h2 className="text-xl font-semibold">{forecastMonthLabel} forecast</h2>
        <p className="mt-1 text-sm text-gray-500">
          Based on the 3-month average from {firstSourceMonth} to{" "}
          {lastSourceMonth}.
        </p>
      </header>

      <section className="mt-6 grid grid-cols-3 gap-4">
        <article className="rounded-lg border p-5">
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="mt-2 text-xl font-semibold">
            {Math.round(revenue).toLocaleString("nb-NO")} kr
          </p>
        </article>

        <article className="rounded-lg border p-5">
          <h3 className="text-sm text-gray-500">Expenses</h3>
          <p className="mt-2 text-xl font-semibold">
            {Math.round(expenses).toLocaleString("nb-NO")} kr
          </p>
        </article>

        <article className="rounded-lg border p-5">
          <h3 className="text-sm text-gray-500">Profit</h3>
          <p className="mt-2 text-xl font-semibold">
            {Math.round(profit).toLocaleString("nb-NO")} kr
          </p>
        </article>
      </section>
    </section>
  );
}
