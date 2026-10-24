import SideBar from "./components/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinanceOS | Financial Dashboard",
  description:
    "FinanceOS is a financial dashboard for tracking transactions, analyzing revenue and expenses, comparing budgets, and forecasting financial performance.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <div className="flex min-h-screen flex-col md:flex-row">
          <SideBar />

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
