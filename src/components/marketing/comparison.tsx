import Link from "next/link";
import { Check, Minus, Star, ArrowRight } from "lucide-react";
import { Section } from "@/components/common/section";
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
  {
    feature: "Minimum 99% purity guarantee",
    us: true,
    others: "Varies",
    gray: false,
  },
  { feature: "U.S. based & shipped", us: true, others: "Sometimes", gray: false },
  {
    feature: "Free shipping threshold",
    us: "$150+",
    others: "Rare",
    gray: false,
  },
  { feature: "Order tracking", us: true, others: true, gray: false },
  { feature: "Cold-chain fulfillment", us: true, others: false, gray: false },
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
          tone === "us" ? "text-primary" : "text-muted-foreground",
        )}
        strokeWidth={2.6}
      />
    ) : (
      <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />
    );
  }
  return (
    <span
      className={cn(
        "text-xs",
        tone === "us" ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

export function Comparison() {
  return (
    <Section
      eyebrow="Why researchers choose Phantom Bio"
      title="Compare, side by side."
      description="An honest comparison against what else is available in the market."
    >
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-1 border-b border-border bg-background/50 px-4 py-3 text-[11px] uppercase tracking-widest text-muted-foreground sm:px-6">
            <div>Feature</div>
            <div className="flex items-center justify-center gap-1.5 text-primary">
              <Star className="h-3 w-3 fill-primary" />
              Phantom Bio
            </div>
            <div className="text-center">Other peptide co.</div>
            <div className="text-center">Gray-market sources</div>
          </div>
          <ul className="divide-y divide-border/60">
            {ROWS.map((r) => (
              <li
                key={r.feature}
                className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-1 px-4 py-4 text-sm sm:px-6"
              >
                <span className="text-foreground/90">{r.feature}</span>
                <div className="rounded-lg bg-primary/5 py-1.5 text-center">
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
    </Section>
  );
}
