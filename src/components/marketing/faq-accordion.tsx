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
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:hsl(var(--brand-500))]" />
          <input
            type="search"
            placeholder="Search questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="glass w-full rounded-full py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2"
          />
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="glass ring-glass rounded-3xl p-8 text-center text-sm text-muted-foreground">
          No questions match &quot;{query}&quot;.
        </p>
      ) : (
        <Reveal>
          <Accordion
            type="single"
            collapsible
            className="glass ring-glass rounded-3xl px-6 md:px-8"
          >
            {filtered.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-white/40 last:border-0"
              >
                <AccordionTrigger className="font-display text-base font-bold tracking-tight text-foreground transition-colors hover:text-[color:hsl(var(--brand-500))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      )}
    </div>
  );
}
