import { getRecentMonthlyTotals } from "./forecast-data";

// Beregner neste måneds forecast fra gjennomsnittet av de tre siste månedene.
// Beregner neste måneds forecast fra de tre siste månedene frem til valgt måned.
export async function calculateForecast(selectedMonth: string) {
  const monthlyTotals = await getRecentMonthlyTotals(selectedMonth, 3);

  if (monthlyTotals.length < 3) {
    return null;
  }

  // Sorterer månedene kronologisk slik at perioden kan vises riktig i brukergrensesnittet.
  const basedOn = monthlyTotals.map((month) => month.month).sort();

  // Finner måneden etter den nyeste måneden i datagrunnlaget.
  const latestMonth = basedOn.at(-1)!;
  const [year, month] = latestMonth.split("-").map(Number);

  const forecastDate = new Date(year, month, 1);

  const forecastMonth = `${forecastDate.getFullYear()}-${String(
    forecastDate.getMonth() + 1,
  ).padStart(2, "0")}`;

  const totalRevenue = monthlyTotals.reduce(
    (sum, month) => sum + Number(month.revenue),
    0,
  );

  const totalExpenses = monthlyTotals.reduce(
    (sum, month) => sum + Number(month.expenses),
    0,
  );

  const revenue = totalRevenue / monthlyTotals.length;
  const expenses = totalExpenses / monthlyTotals.length;
  const profit = revenue - expenses;

  return {
    month: forecastMonth,
    basedOn,
    revenue,
    expenses,
    profit,
  };
}
