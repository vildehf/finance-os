export type AccountingTransaction = {
  externalId: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "revenue" | "expense";
};

// Kontrollerer at data fra API-et har riktig struktur.
export function isAccountingTransaction(
  value: unknown,
): value is AccountingTransaction {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const transaction = value as Record<string, unknown>;

  return (
    typeof transaction.externalId === "string" &&
    transaction.externalId.trim().length > 0 &&
    typeof transaction.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(transaction.date) &&
    typeof transaction.description === "string" &&
    transaction.description.trim().length > 0 &&
    typeof transaction.amount === "number" &&
    Number.isFinite(transaction.amount) &&
    transaction.amount > 0 &&
    typeof transaction.category === "string" &&
    transaction.category.trim().length > 0 &&
    (transaction.type === "revenue" || transaction.type === "expense")
  );
}
