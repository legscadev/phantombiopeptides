"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { WCProduct } from "@/types";

interface SearchCommandProps {
  variant?: "navbar" | "hero";
}

async function fetchSuggestions(q: string, signal: AbortSignal) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, {
    signal,
  });
  if (!res.ok) return { products: [] as WCProduct[] };
  return (await res.json()) as { products: WCProduct[] };
}

export function SearchCommand({ variant = "navbar" }: SearchCommandProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<WCProduct[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const { products } = await fetchSuggestions(query, ctrl.signal);
        setResults(products);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [query]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className={
        variant === "hero"
          ? "relative w-full max-w-xl"
          : "relative w-full max-w-md"
      }
    >
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="search"
          placeholder={
            variant === "hero"
              ? "Search 200+ research compounds…"
              : "Search peptides…"
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className={
            "w-full rounded-full border border-border bg-input py-2.5 pl-11 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring transition-colors"
          }
          aria-label="Search products"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {open && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl glass-strong shadow-2xl overflow-hidden z-50">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-6 text-sm text-muted-foreground">
              No products match &quot;{query}&quot;.
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-96 overflow-y-auto p-2">
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-background-elevated transition-colors"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-background">
                      {p.images[0] && (
                        <Image
                          src={p.images[0].src}
                          alt={p.images[0].alt || p.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">
                        {p.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
              <li className="border-t border-border/50 mt-2 pt-2">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 text-xs text-primary hover:underline"
                >
                  View all results →
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
