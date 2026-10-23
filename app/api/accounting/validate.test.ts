import { describe, expect, it } from "vitest";
import { isAccountingTransaction } from "./validate";

describe("isAccountingTransaction", () => {
  it("accepts a valid accounting transaction", () => {
    const transaction = {
      externalId: "ACC-1001",
      date: "2026-10-03",
      description: "Customer invoice",
      amount: 48000,
      category: "Sales",
      type: "revenue",
    };

    expect(isAccountingTransaction(transaction)).toBe(true);
  });

  it("rejects a transaction with a negative amount", () => {
    const transaction = {
      externalId: "ACC-1002",
      date: "2026-10-10",
      description: "Office rent",
      amount: -12000,
      category: "Office",
      type: "expense",
    };

    expect(isAccountingTransaction(transaction)).toBe(false);
  });
});
