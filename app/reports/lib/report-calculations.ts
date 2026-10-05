// Beregner prosentvis endring mellom to perioder.
export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return null;
  }

  return ((current - previous) / previous) * 100;
}

// Beregner forrige periodes stolpebredde relativt til valgt periode.
export function calculateBarWidth(previous: number, current: number) {
  if (current === 0) {
    return 0;
  }

  return (previous / current) * 100;
}

// Finner måneden før en rapportmåned på formatet YYYY-MM.
export function getPreviousMonth(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const previousDate = new Date(year, monthNumber - 2);

  return `${previousDate.getFullYear()}-${String(
    previousDate.getMonth() + 1,
  ).padStart(2, "0")}`;
}

// Formaterer en rapportmåned fra YYYY-MM til en lesbar måned og år.
export function formatMonthLabel(month: string) {
  return new Date(`${month}-01`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
}

type MonthlyTotal = {
  month: string;
  type: string | null;
  total: string;
};

// Henter revenue, expenses og profit for én måned fra de summerte transaksjonsdataene.
export function getMonthlyFinancials(totals: MonthlyTotal[], month: string) {
  const revenue = Number(
    totals.find((row) => row.month === month && row.type === "revenue")
      ?.total ?? 0,
  );

  const expenses = Number(
    totals.find((row) => row.month === month && row.type === "expense")
      ?.total ?? 0,
  );

  return {
    revenue,
    expenses,
    profit: revenue - expenses,
  };
}
