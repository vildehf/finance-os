// Simulerer transaksjoner fra et eksternt regnskapssystem.
export const mockAccountingTransactions = [
  {
    externalId: "ACC-1001",
    date: "2026-10-03",
    description: "Customer invoice - October",
    amount: 48000,
    category: "Sales",
    type: "revenue",
  },
  {
    externalId: "ACC-1002",
    date: "2026-10-10",
    description: "Office rent - October",
    amount: 12000,
    category: "Office",
    type: "expense",
  },
  {
    externalId: "ACC-1003",
    date: "2026-10-15",
    description: "Software subscriptions",
    amount: 6400,
    category: "Software",
    type: "expense",
  },
];
