import Link from "next/link";
import { Check, X, Star, ArrowRight } from "lucide-react";
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
  { feature: "Free shipping threshold", us: "$125+", others: "Rare", gray: false },
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
          tone === "us"
            ? "text-[color:hsl(var(--brand-500))]"
            : "text-muted-foreground",
        )}
        strokeWidth={2.8}
      />
    ) : (
      <X className="mx-auto h-4 w-4 text-muted-foreground/50" strokeWidth={2.2} />
    );
  }
  return (
    <span
      className={cn(
        "text-xs",
        tone === "us" ? "font-medium text-foreground" : "text-muted-foreground",
      )}
    >
      {value}
    </span>
  );
}

export function Comparison() {
  return (
    <section className="bg-ambient relative overflow-hidden py-20 md:py-28">
      <div className="container-page relative">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
              <span className="h-px w-6 bg-[color:hsl(var(--brand-500))]/50" />
              How we compare
            </p>
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl text-balance">
              Why researchers choose{" "}
              <span className="text-brand-gradient">Phantom Bio</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              An honest comparison against what else is available.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="glass ring-glass overflow-hidden rounded-3xl">
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-1 border-b border-white/50 px-4 py-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:px-6">
              <div>Feature</div>
              <div
                className="flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                  boxShadow:
                    "0 8px 20px -10px hsl(var(--brand-500) / 0.55)",
                }}
              >
                <Star className="h-3 w-3 fill-current" />
                Phantom Bio
              </div>
              <div className="text-center">Other peptide co.</div>
              <div className="text-center">Gray-market</div>
            </div>
            <ul className="divide-y divide-white/40">
              {ROWS.map((r, i) => (
                <li
                  key={r.feature}
                  className={cn(
                    "grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-1 px-4 py-4 text-sm sm:px-6",
                    i % 2 === 1 && "bg-white/25",
                  )}
                >
                  <span className="text-foreground/90">{r.feature}</span>
                  <div
                    className="rounded-lg py-1.5 text-center"
                    style={{
                      background:
                        "linear-gradient(180deg, hsl(var(--brand-50)) 0%, hsl(var(--brand-100) / 0.6) 100%)",
                    }}
                  >
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

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/shop">
              Shop Phantom Bio <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
