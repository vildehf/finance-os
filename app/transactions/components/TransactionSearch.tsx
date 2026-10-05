"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function TransactionSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Beholder eksisterende søk i feltet når siden lastes på nytt.
  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  // Oppdaterer URL-en med søket uten å fjerne andre aktive filtre.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.push(query ? `/transactions?${query}` : "/transactions");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full md:max-w-sm"
      role="search"
    >
      <Search
        aria-hidden="true"
        size={18}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
      />

      <label htmlFor="transaction-search" className="sr-only">
        Search transactions
      </label>

      <input
        id="transaction-search"
        type="search"
        value={search}
        onChange={(event) => {
          const value = event.target.value;
          setSearch(value);

          // Fjerner søkefilteret fra URL-en når søkefeltet tømmes.
          if (!value) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("search");

            const query = params.toString();

            router.push(query ? `/transactions?${query}` : "/transactions");
          }
        }}
        placeholder="Search transactions..."
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pr-3 pl-10 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </form>
  );
}
