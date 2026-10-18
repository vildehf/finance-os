import { NextRequest, NextResponse } from "next/server";
import { mockAccountingTransactions } from "../mock-data";
import { isAccountingTransaction } from "../validate";
import { saveAccountingTransactions } from "../save-transactions";

// Importerer regnskapsdata når forespørselen har gyldig tilgang.
export async function POST(request: NextRequest) {
  // Tillater bare manuell testimport under lokal utvikling.
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Import is only available in development" },
      { status: 403 },
    );
  }
  const secret = process.env.ACCOUNTING_IMPORT_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validerer eksempeldata før de sendes til databasen.
    if (!mockAccountingTransactions.every(isAccountingTransaction)) {
      throw new Error("Invalid accounting transaction data");
    }

    const importedTransactions = mockAccountingTransactions;

    const insertedCount =
      await saveAccountingTransactions(importedTransactions);

    return NextResponse.json({
      success: true,
      received: importedTransactions.length,
      inserted: insertedCount,
      skipped: importedTransactions.length - insertedCount,
    });
  } catch (error) {
    console.error("Accounting import failed:", error);

    return NextResponse.json(
      { error: "Accounting import failed" },
      { status: 500 },
    );
  }
}
