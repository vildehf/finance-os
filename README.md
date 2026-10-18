# FinanceOS

**A financial dashboard for small businesses, built with Next.js, TypeScript, and PostgreSQL.**

FinanceOS is a portfolio project exploring how financial transaction data can be transformed into useful reports, visualizations and decision-support insights.

The application currently uses sample financial data and is intended as a demonstration of full-stack development and financial data analysis.

**Live Demo:** [View FinanceOS](https://finance-os-zeta.vercel.app/)

## Features

- **Dashboard** – Overview of revenue, expenses, and profit, including month-over-month changes.
- **Transactions** – Browse, search, and filter financial transactions by type, description, category and date.
- **Monthly reports** – Analyze financial performance across available reporting periods.
- **Budget vs. actual** – Compare actual results with budgeted revenue, expenses, and profit.
- **Financial insights** – Generate observations based on monthly financial performance.
- **Forecasting** – Estimate the next month's revenue, expenses and profit using a three-month moving average.
- **CSV export** – Download monthly financial reports for use in Excel, Power BI, and other analysis tools.
- **Responsive interface** – Navigate the application on desktop and mobile devices.

## Tech Stack

| Technology           | Purpose                           |
| -------------------- | --------------------------------- |
| Next.js (App Router) | Full-stack application framework  |
| React                | User interface                    |
| TypeScript           | Type-safe application development |
| Tailwind CSS         | Responsive styling                |
| PostgreSQL (Neon)    | Relational database               |
| Drizzle ORM          | Database queries and schema       |
| Lucide React         | Interface icons                   |
| Vercel               | Deployment and hosting            |

## How It Works

FinanceOS stores sample financial transactions and monthly budgets in PostgreSQL.

The application retrieves and aggregates this data using Drizzle ORM. Server-side calculations produce monthly financial summaries, budget comparisons and financial insights.

Forecasts are calculated using a three-month moving average of historical financial data.

Users can export monthly financial summaries as CSV files through a Next.js API route.

## Getting Started

### Prerequisites

- Node.js
- npm
- A PostgreSQL database

### Installation

Clone the repository:

```bash
git clone https://github.com/vildehf/finance-os.git
cd finance-os
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file in the project root and configure your database connection:

```env
DATABASE_URL=your_postgresql_connection_string
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note:** A PostgreSQL database with the required schema and sample data is needed to display financial information. The database connection string is not included in this repository.

## Project Status

FinanceOS is an ongoing portfolio project.

The current version demonstrates financial reporting, transaction filtering, forecasting and CSV export using sample data.

Potential future improvements include:

- Integration with accounting systems such as Tripletex
- More detailed transaction drilldowns
- Additional export formats
- Expanded forecasting and financial analysis
- User authentication and company-specific settings

## Disclaimer

FinanceOS currently uses fictional financial data and is not intended for production accounting or financial decision-making.

## Author

Developed as a personal full-stack development and financial analytics portfolio project.
