import ReportBar from "../../components/ReportBar";

type FinancialOverviewProps = {
  hasPreviousMonthData: boolean;
  previousMonth: {
    label: string;
    revenue: number;
    expenses: number;
    profit: number;
  };
  selectedMonth: {
    label: string;
    revenue: number;
    expenses: number;
    profit: number;
  };
  widths: {
    revenue: number;
    expenses: number;
    profit: number;
  };
};

// Viser en visuell sammenligning mellom valgt måned og måneden før.
export default function FinancialOverview({
  hasPreviousMonthData,
  previousMonth,
  selectedMonth,
  widths,
}: FinancialOverviewProps) {
  return (
    <section className="mt-8">
      <h2 className="text-center font-semibold md:text-left">
        Financial overview
      </h2>
      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-medium">Revenue</h3>
        <ReportBar
          label={previousMonth.label}
          amount={previousMonth.revenue}
          width={widths.revenue}
          hasData={hasPreviousMonthData}
        />
        <ReportBar
          label={selectedMonth.label}
          amount={selectedMonth.revenue}
          width={100}
          variant="selected"
        />
      </article>

      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-medium">Expenses</h3>
        <ReportBar
          label={previousMonth.label}
          amount={previousMonth.expenses}
          width={widths.expenses}
          hasData={hasPreviousMonthData}
        />
        <ReportBar
          label={selectedMonth.label}
          amount={selectedMonth.expenses}
          width={100}
          variant="selected"
        />
      </article>

      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-medium">Profit</h3>
        <ReportBar
          label={previousMonth.label}
          amount={previousMonth.profit}
          width={widths.profit}
          hasData={hasPreviousMonthData}
        />
        <ReportBar
          label={selectedMonth.label}
          amount={selectedMonth.profit}
          width={100}
          variant="selected"
        />
      </article>
    </section>
  );
}
