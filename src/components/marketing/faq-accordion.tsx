"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/common/reveal";
import { cn } from "@/lib/utils";

export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

export function FAQAccordion({
  items,
  searchable = false,
  className,
}: {
  items: FAQItem[];
  searchable?: boolean;
  className?: string;
}) {
  const [query, setQuery] = React.useState("");
  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.q.toLowerCase().includes(q) ||
        it.a.toLowerCase().includes(q) ||
        it.category?.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <div className={cn("space-y-6", className)}>
      {searchable && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-border bg-input py-3 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-ring"
          />
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No questions match &quot;{query}&quot;.
        </p>
      ) : (
        <Reveal>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6">
            {filtered.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      )}
    </div>
  );
}
