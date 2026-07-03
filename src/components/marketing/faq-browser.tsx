"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
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

  // When no category is active, group by category so the reader can scan by topic.
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
    <div className="space-y-10">
      {/* Search + pills */}
      <div className="space-y-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search all questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-background-elevated py-4 pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="no-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 md:flex-wrap md:overflow-visible">
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
        <EmptyState query={query} />
      ) : grouped ? (
        <div className="space-y-10">
          {grouped.map(([cat, list]) => (
            <div key={cat}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-xs uppercase tracking-[0.22em] text-primary">
                  {cat}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {list.length} question{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <Accordion
                type="single"
                collapsible
                className="rounded-2xl border border-border bg-card px-6"
              >
                {list.map((item, i) => (
                  <AccordionItem key={i} value={`${cat}-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
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
          className="rounded-2xl border border-border bg-card px-6"
        >
          {filtered.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Contact CTA */}
      <div className="mt-16 rounded-3xl border border-border bg-background-elevated p-8 md:p-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary">
              Still stuck?
            </p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Talk to a real researcher.
            </h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              Our team answers questions about compounds, batches, and orders
              within one business day.
            </p>
          </div>
          <Button size="lg" asChild>
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
        "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
        active
          ? "bg-foreground text-background shadow-[0_10px_30px_-10px_hsl(var(--foreground)/0.4)]"
          : "border border-border bg-background-elevated text-foreground/70 hover:border-border-strong hover:bg-background-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <p className="text-sm text-muted-foreground">
        {query
          ? `No questions match “${query}”.`
          : "No questions in this category yet."}
      </p>
    </div>
  );
}
