"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Filter-bar search input for /shop/all and /category/[slug]. Writes
 * to the `q` query param, which ProductsService.list already reads
 * and forwards as WooCommerce's `search` — so the grid re-fetches
 * with the filter applied. Preserves other params (sort, page,
 * category) on every navigation.
 */
export function ProductSearchInput({
  className,
  placeholder = "Search this catalog…",
}: {
  className?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initial = searchParams.get("q") ?? "";
  const [value, setValue] = React.useState(initial);

  // Keep the input in sync if the URL changes elsewhere (nav, back button).
  React.useEffect(() => {
    setValue(initial);
  }, [initial]);

  function commit(next: string) {
    const sp = new URLSearchParams(searchParams.toString());
    const trimmed = next.trim();
    if (trimmed) sp.set("q", trimmed);
    else sp.delete("q");
    sp.delete("page"); // reset pagination on a new query
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit(value);
    }
  }

  function clear() {
    setValue("");
    commit("");
  }

  return (
    <div className={cn("relative w-full max-w-xl", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Search products"
        className="w-full rounded-full border border-border bg-input py-2.5 pl-11 pr-11 text-sm placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
