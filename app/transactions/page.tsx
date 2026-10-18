import Link from "next/link";
import { transactions } from "@/db/schema";
import { db } from "../../db";
import { desc, eq, and, gte, lt, ilike, or, sql } from "drizzle-orm";
import TransactionSearch from "./components/TransactionSearch";

// Formaterer dato fra YYYY-MM-DD til DD.MM.YYYY
function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

// Gjør første bokstav stor
function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Bygger filterlenker uten å miste aktive måneds- eller søkefiltre.
function buildFilterHref({
  type,
  month,
  search,
}: {
  type?: string;
  month?: string;
  search?: string;
}) {
  const params = new URLSearchParams();

  if (type) params.set("type", type);
  if (month) params.set("month", month);
  if (search) params.set("search", search);

  const query = params.toString();

  return query ? `/transactions?${query}` : "/transactions";
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    month?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const type = params.type;
  const month = params.month;
  const search = params.search?.trim();
  const normalizedSearch =
    search?.toLowerCase() === "expenses" ? "expense" : search;
  const monthLabel = month
    ? new Date(`${month}-01`).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  const validType = type === "revenue" || type === "expense" ? type : undefined;
  const startDate = month ? `${month}-01` : undefined;

  const nextMonth = month ? new Date(`${month}-01T00:00:00`) : undefined;

  if (nextMonth) {
    nextMonth.setMonth(nextMonth.getMonth() + 1);
  }

  const endDate = nextMonth
    ? `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(
        2,
        "0",
      )}-01`
    : undefined;

  // Henter transaksjoner og kombinerer aktive type-, måneds- og søkefiltre.
  const allTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        validType ? eq(transactions.type, validType) : undefined,
        startDate ? gte(transactions.date, startDate) : undefined,
        endDate ? lt(transactions.date, endDate) : undefined,
        normalizedSearch
          ? or(
              ilike(transactions.description, `%${normalizedSearch}%`),
              ilike(transactions.category, `%${normalizedSearch}%`),
              ilike(transactions.type, `%${normalizedSearch}%`),
              sql`${transactions.date}::text ILIKE ${`%${normalizedSearch}%`}`,
            )
          : undefined,
      ),
    )
    .orderBy(desc(transactions.date));

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <header className="text-center md:text-left">
        <h1 className="text-3xl font-semibold">Transactions</h1>
        <p className="mt-2 text-gray-500">
          View and analyze company transactions.
        </p>

        {monthLabel && (
          <p className="mt-2 text-sm font-medium text-gray-700">{monthLabel}</p>
        )}
      </header>

      {/* Filter */}
      <section
        className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        aria-label="Search and filter transactions"
      >
        <TransactionSearch />

        <div className="flex flex-wrap items-center gap-3">
          <nav className="flex gap-2" aria-label="Filter transactions by type">
            <Link
              href={buildFilterHref({ month, search })}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                !validType
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              All
            </Link>

            <Link
              href={buildFilterHref({
                type: "revenue",
                month,
                search,
              })}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                validType === "revenue"
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              Revenue
            </Link>

            <Link
              href={buildFilterHref({
                type: "expense",
                month,
                search,
              })}
              className={`rounded-md border px-3 py-2 text-sm transition-colors ${
                validType === "expense"
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              Expenses
            </Link>
          </nav>
          {(validType || month || search) && (
            <Link
              href="/transactions"
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              Clear filters
            </Link>
          )}
        </div>
      </section>

      <section className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="w-32 p-4 text-sm font-medium">Date</th>
              <th className="p-4 text-sm font-medium">Description</th>
              <th className="w-32 p-4 text-sm font-medium">Category</th>
              <th className="w-28 p-4 text-sm font-medium">Type</th>
              <th className="w-32 p-4 text-right text-sm font-medium">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {allTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b transition-colors last:border-b-0 hover:bg-blue-50/40"
              >
                <td className="p-4 text-sm">{formatDate(transaction.date)}</td>

                <td className="p-4 text-sm font-medium">
                  {transaction.description}
                </td>

                <td className="p-4 text-sm text-gray-600">
                  {transaction.category}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      transaction.type === "revenue"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {capitalize(transaction.type)}
                  </span>
                </td>

                <td className="p-4 text-right text-sm font-medium">
                  {Number(transaction.amount).toLocaleString("nb-NO")} kr
                </td>
              </tr>
            ))}

            {allTransactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-sm text-slate-500"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
