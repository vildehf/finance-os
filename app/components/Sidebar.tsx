import Link from "next/link";

export default function SideBar() {
  return (
    <aside className="w-64 border-2 p-6">
      <h2 className="text-xl font-semibold">FinanceOS</h2>

      <nav className="mt-8 flex flex-col gap-3">
        <Link href="/">Dashboard</Link>
        <Link href="/transactions">Transactions</Link>
        <Link href="/reports">Reports</Link>
      </nav>
    </aside>
  );
}
