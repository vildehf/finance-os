import { NextResponse } from "next/server";
import { mockAccountingTransactions } from "./mock-data";

// Returnerer simulerte regnskapstransaksjoner som JSON.
export async function GET() {
  return NextResponse.json({
    source: "mock-accounting-system",
    transactions: mockAccountingTransactions,
  });
}
