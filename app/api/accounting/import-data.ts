import {
  isAccountingTransaction,
  type AccountingTransaction,
} from "./validate";

type AccountingApiResponse = {
  source: string;
  transactions: unknown[];
};

// Henter transaksjoner fra API-et og validerer responsen.
export async function fetchAccountingTransactions(
  apiUrl: string,
): Promise<AccountingTransaction[]> {
  const response = await fetch(apiUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Accounting API returned ${response.status}`);
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("transactions" in data) ||
    !Array.isArray(data.transactions)
  ) {
    throw new Error("Invalid accounting API response");
  }

  const transactions: AccountingApiResponse["transactions"] = data.transactions;

  if (!transactions.every(isAccountingTransaction)) {
    throw new Error("Invalid transaction data received");
  }

  return transactions;
}
