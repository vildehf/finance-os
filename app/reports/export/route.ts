import { NextRequest } from "next/server";
import { getBudgetByMonth, getTotalsByMonthAndType } from "../lib/report-data";
import { getMonthlyFinancials } from "../lib/report-calculations";
import { generateReportCsv } from "../lib/export-csv";

// Henter rapportdata for valgt måned og returnerer en nedlastbar CSV-fil.
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month");

  // Krever en gyldig måned i formatet YYYY-MM.
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return new Response("Invalid month", { status: 400 });
  }

  // Henter faktiske tall og budsjett fra databasen.
  const [totalsByMonthAndType, budget] = await Promise.all([
    getTotalsByMonthAndType(),
    getBudgetByMonth(month),
  ]);

  // Kontrollerer at måneden finnes i transaksjonsdataene.
  const hasMonthData = totalsByMonthAndType.some((row) => row.month === month);

  if (!hasMonthData) {
    return new Response("No report data for selected month", {
      status: 404,
    });
  }

  // Beregner månedens inntekter, kostnader og resultat.
  const { revenue, expenses, profit } = getMonthlyFinancials(
    totalsByMonthAndType,
    month,
  );

  // Bygger CSV-innholdet med budsjettverdier bare når budsjett finnes.
  const csv = generateReportCsv([
    { metric: "Revenue", amount: revenue },
    { metric: "Expenses", amount: expenses },
    { metric: "Profit", amount: profit },
    {
      metric: "Budget Revenue",
      amount: budget ? Number(budget.revenue) : null,
    },
    {
      metric: "Budget Expenses",
      amount: budget ? Number(budget.expenses) : null,
    },
  ]);

  return new Response("\uFEFF" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="financeos-report-${month}.csv"`,
    },
  });
}
