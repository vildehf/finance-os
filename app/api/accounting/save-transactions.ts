import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { AccountingTransaction } from "./validate";

const ACCOUNTING_SOURCE = "mock-accounting-system";

// Lagrer importerte transaksjoner uten å opprette duplikater.
export async function saveAccountingTransactions(
  importedTransactions: AccountingTransaction[],
) {
  if (importedTransactions.length === 0) {
    return 0;
  }

  const values = importedTransactions.map((transaction) => ({
    date: transaction.date,
    description: transaction.description,
    amount: transaction.amount.toString(),
    category: transaction.category,
    type: transaction.type,
    externalId: transaction.externalId,
    source: ACCOUNTING_SOURCE,
  }));

  const inserted = await db
    .insert(transactions)
    .values(values)
    .onConflictDoNothing({
      target: [transactions.source, transactions.externalId],
    })
    .returning({ id: transactions.id });

  return inserted.length;
}
