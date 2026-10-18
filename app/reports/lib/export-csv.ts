type CsvRow = {
  metric: string;
  amount: number | null;
};

// Gjør rapporttall om til CSV-format som kan åpnes i Excel og Power BI.
export function generateReportCsv(rows: CsvRow[]) {
  const header = "Metric, Amount (NOK)";

  const dataRows = rows.map(({ metric, amount }) => {
    const safeMetric = `"${metric.replaceAll('"', '""')}"`;
    return `${safeMetric}, ${amount ?? ""}`;
  });

  return [header, ...dataRows].join("\r\n");
}
