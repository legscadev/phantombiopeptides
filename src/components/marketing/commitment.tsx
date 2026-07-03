import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";

/**
 * "Commitment" — mirrors Phantom's live "Never Sell a Batch Without Proof"
 * layout: pull-quote on the left, 2×2 grid of alternating violet + dark
 * stat cards on the right.
 */
const STATS = [
  { n: "99%+", label: "Avg. purity", tone: "violet" },
  { n: "100%", label: "Batches tested", tone: "dark" },
  { n: "Same Day", label: "Fulfilment", tone: "dark" },
  { n: "Free", label: "Shipping $250+", tone: "violet" },
];

export function Commitment() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
                Our commitment
              </p>
              <h2 className="mt-3 max-w-lg text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Phantom Bio never ships a batch without proof of purity.
              </h2>
              <p className="mt-5 max-w-md text-muted-foreground leading-relaxed">
                Every product is independently tested by ISL Labs before it
                leaves our facility. COAs are published to our library the
                same day the batch is released — before you place your order.
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/coa">
                    View COA library <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/about">Our story</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className={
                    s.tone === "violet"
                      ? "rounded-md bg-primary p-8 text-primary-foreground"
                      : "rounded-md border border-border bg-card p-8 text-foreground"
                  }
                >
                  <div className="font-display text-4xl font-bold tracking-tight">
                    {s.n}
                  </div>
                  <div className="mt-2 text-xs uppercase tracking-widest opacity-80">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
