"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FAQItem } from "./faq-accordion";

interface FAQBrowserProps {
  items: FAQItem[];
}

const UNCATEGORIZED = "Other";

export function FAQBrowser({ items }: FAQBrowserProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState<string | null>(null);

  const categories = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of items) {
      const c = it.category || UNCATEGORIZED;
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [items]);

  const filtered = React.useMemo(() => {
    let list = items;
    if (active) {
      list = list.filter((it) => (it.category ?? UNCATEGORIZED) === active);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (it) =>
          it.q.toLowerCase().includes(q) ||
          it.a.toLowerCase().includes(q) ||
          it.category?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, active, query]);

  const grouped = React.useMemo(() => {
    if (active || query.trim()) return null;
    const map = new Map<string, FAQItem[]>();
    for (const it of filtered) {
      const c = it.category || UNCATEGORIZED;
      if (!map.has(c)) map.set(c, []);
      map.get(c)!.push(it);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered, active, query]);

  return (
    <div className="space-y-12">
      {/* Search + pills — floated on a glass panel */}
      <div className="glass ring-glass rounded-3xl p-5 md:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search all questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-border/60 bg-white/70 py-4 pl-12 pr-11 text-sm placeholder:text-muted-foreground focus:border-[color:hsl(var(--brand-500))]/50 focus:outline-none focus:ring-4 focus:ring-[color:hsl(var(--brand-500))]/12"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="no-scrollbar mt-5 -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 md:flex-wrap md:overflow-visible">
          <PillButton
            active={active === null}
            onClick={() => setActive(null)}
          >
            All <span className="ml-1.5 opacity-60">{items.length}</span>
          </PillButton>
          {categories.map(([cat, count]) => (
            <PillButton
              key={cat}
              active={active === cat}
              onClick={() => setActive(cat)}
            >
              {cat} <span className="ml-1.5 opacity-60">{count}</span>
            </PillButton>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <EmptyState query={query} onClear={() => setQuery("")} />
      ) : grouped ? (
        <div className="space-y-10">
          {grouped.map(([cat, list]) => (
            <div key={cat}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                  {cat}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {list.length} question{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <Accordion
                type="single"
                collapsible
                className="glass ring-glass rounded-3xl px-6"
              >
                {list.map((item, i) => (
                  <AccordionItem key={i} value={`${cat}-${i}`}>
                    <AccordionTrigger className="text-left font-display text-base font-bold tracking-tight">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="glass ring-glass rounded-3xl px-6"
        >
          {filtered.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-display text-base font-bold tracking-tight">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Contact CTA — brand-tinted glass panel */}
      <div
        className="ring-glass relative overflow-hidden rounded-3xl p-8 md:p-12"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--brand-50)) 0%, rgba(255,255,255,0.7) 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--brand-400)) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
              Still stuck?
            </p>
            <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Talk to a real researcher.
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Our team answers questions about compounds, batches, and orders
              within one business day.
            </p>
          </div>
          <Button size="lg" asChild className="shrink-0">
            <Link href="/contact">
              Contact support <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2",
        active
          ? "text-white shadow-[0_10px_24px_-10px_hsl(var(--brand-500)/0.55)]"
          : "border border-border bg-white/60 text-foreground/70 hover:border-border-strong hover:bg-white/90 hover:text-foreground",
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}

function EmptyState({
  query,
  onClear,
}: {
  query: string;
  onClear: () => void;
}) {
  return (
    <div className="glass ring-glass rounded-3xl p-12 text-center">
      <p className="text-sm text-muted-foreground">
        {query
          ? `No questions match “${query}”.`
          : "No questions in this category yet."}
      </p>
      {query && (
        <button
          type="button"
          onClick={onClear}
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:hsl(var(--brand-500))] hover:underline"
        >
          Clear search
        </button>
      )}
    </div>
  );
}
