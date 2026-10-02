import Link from "next/link";
import { transactions } from "@/db/schema";
import { db } from "../../db";
import { desc, eq, and, gte, lt } from "drizzle-orm";

// Formaterer dato fra YYYY-MM-DD til DD.MM.YYYY
function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

// Gjør første bokstav stor
function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    month?: string;
  }>;
}) {
  const params = await searchParams;
  const type = params.type;
  const month = params.month;
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
  // Henter transaksjoner fra databasen.
  // Hvis URL-en har et gyldig type-filter, filtrerer vi i databasen.
  const allTransactions = await db
    .select()
    .from(transactions)
    .where(
      and(
        validType ? eq(transactions.type, validType) : undefined,
        startDate ? gte(transactions.date, startDate) : undefined,
        endDate ? lt(transactions.date, endDate) : undefined,
      ),
    )
    .orderBy(desc(transactions.date));

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-semibold">Transactions</h1>{" "}
        <p className="mt-2 text-gray-500">
          View and analyze company transactions.
        </p>
        {monthLabel && (
          <p className="mt-2 text-sm font-medium text-gray-700">{monthLabel}</p>
        )}
      </div>

      {/* Filter */}
      <div className="mt-6 flex gap-2">
        <Link
          href={month ? `/transactions?month=${month}` : "/transactions"}
          className={`rounded-md border px-3 py-2 text-sm ${
            !validType ? "bg-black text-white" : "bg-white text-gray-700"
          }`}
        >
          All
        </Link>

        <Link
          href={
            month
              ? `/transactions?type=revenue&month=${month}`
              : "/transactions?type=revenue"
          }
          className={`rounded-md border px-3 py-2 text-sm ${
            validType === "revenue"
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Revenue
        </Link>

        <Link
          href={
            month
              ? `/transactions?type=expense&month=${month}`
              : "/transactions?type=expense"
          }
          className={`rounded-md border px-3 py-2 text-sm ${
            validType === "expense"
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Expenses
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-lg border">
        <table className="min-w-[800px] w-full text-left">
          <thead className="border-b bg-gray-50 text-gray-600">
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
                className="border-b transition-colors last:border-b-0 hover:bg-gray-50"
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
