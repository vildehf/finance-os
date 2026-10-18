"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";
import UserAvatar from "./UserAvatar";

// Definerer hovedsidene og ikonene som vises i navigasjonen.
const navigationItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
  { href: "/reports", label: "Reports", icon: ChartNoAxesCombined },
];

export default function SideBar() {
  // Henter aktiv URL slik at riktig navigasjonslenke kan markeres.
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-64 md:border-r md:border-b-0 md:p-6">
      <header>
        <Link
          href="/"
          className="flex items-center justify-center gap-3 rounded-lg md:justify-start"
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-sm font-semibold text-white shadow-sm"
          >
            F
          </span>

          <span className="text-xl font-semibold tracking-tight">
            FinanceOS
          </span>
        </Link>
      </header>
      <nav className="mt-6 flex gap-2 md:mt-8 md:flex-col md:gap-3">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-blue-50 ${
                isActive
                  ? "bg-blue-50 font-medium text-blue-700 shadow-sm ring-1 ring-blue-100"
                  : "text-slate-600"
              }`}
            >
              <Icon size={18} aria-hidden="true" /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden pt-8 md:block">
        <UserAvatar name="Demo User" subtitle="FinanceOS Workspace" />
      </div>
    </aside>
  );
}
