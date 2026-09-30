export default function SideBar() {
  return (
    <aside className="w-64 border-2 p-6">
      <h2 className="text-xl font-semibold">FinanceOS</h2>

      <nav className="mt-8 flex flex-col gap-3">
        <a href="/">Dashboard</a>
        <a href="/transactions">Transactions</a>
        <a href="/reports">Reports</a>
      </nav>
    </aside>
  );
}
