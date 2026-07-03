import Link from "next/link";
import { Check, Minus, Star, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Row {
  feature: string;
  us: boolean | string;
  others: boolean | string;
  gray: boolean | string;
}

const ROWS: Row[] = [
  { feature: "Independent 3rd-party COA", us: true, others: false, gray: false },
  { feature: "Minimum 99% purity guarantee", us: true, others: "Varies", gray: false },
  { feature: "U.S. based & shipped", us: true, others: "Sometimes", gray: false },
  { feature: "Free shipping threshold", us: "$250+", others: "Rare", gray: false },
  { feature: "Order tracking", us: true, others: true, gray: false },
  { feature: "Same-day fulfilment", us: true, others: false, gray: false },
  { feature: "Bulk / institutional pricing", us: true, others: "Limited", gray: false },
  { feature: "Human support (business hours)", us: true, others: "Chatbot", gray: false },
  { feature: "Age & compliance gating", us: true, others: "Weak", gray: false },
];

function Cell({ value, tone }: { value: boolean | string; tone: "us" | "muted" }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check
        className={cn(
          "mx-auto h-4 w-4",
          tone === "us" ? "text-primary" : "text-neutral-500",
        )}
        strokeWidth={2.6}
      />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-neutral-400" />
    );
  }
  return (
    <span
      className={cn(
        "text-xs",
        tone === "us" ? "text-neutral-900" : "text-neutral-500",
      )}
    >
      {value}
    </span>
  );
}

/**
 * Phantom's comparison section is the only light-mode surface on the page —
 * intentional contrast against the dark rest of the site.
 */
export function Comparison() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            The Phantom standard
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why Researchers Choose Phantom
          </h2>
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-md bg-white text-neutral-900">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-1 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-[11px] uppercase tracking-widest text-neutral-500 sm:px-6">
              <div>Feature</div>
              <div className="flex items-center justify-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 text-primary">
                <Star className="h-3 w-3 fill-primary" />
                Phantom Bio
              </div>
              <div className="text-center">Other peptide co.</div>
              <div className="text-center">Gray-market</div>
            </div>
            <ul className="divide-y divide-neutral-200">
              {ROWS.map((r, i) => (
                <li
                  key={r.feature}
                  className={cn(
                    "grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-1 px-4 py-4 text-sm sm:px-6",
                    i % 2 === 1 && "bg-neutral-50",
                  )}
                >
                  <span className="text-neutral-900">{r.feature}</span>
                  <div className="rounded-md bg-primary/5 py-1.5 text-center">
                    <Cell value={r.us} tone="us" />
                  </div>
                  <div className="py-1.5 text-center">
                    <Cell value={r.others} tone="muted" />
                  </div>
                  <div className="py-1.5 text-center">
                    <Cell value={r.gray} tone="muted" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/shop">
              Shop Phantom Bio <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/coa">See our COA library</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
