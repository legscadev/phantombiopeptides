import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";

/**
 * "Never Sell a Batch Without Proof" — pull-quote left, 2×2 grid of
 * violet-family stat squares right. Mirrors EVO Labs' colored stat
 * grid using Phantom Bio violet variants.
 */
const STATS = [
  {
    n: "99%+",
    label: "Avg. purity",
    bg: "radial-gradient(120% 100% at 30% 0%, hsl(264 100% 44%) 0%, hsl(264 100% 28%) 100%)",
    border: "border-primary/50",
  },
  {
    n: "100%",
    label: "Batches tested",
    bg: "radial-gradient(120% 100% at 70% 0%, hsl(245 66% 32%) 0%, hsl(245 66% 18%) 100%)",
    border: "border-indigo-500/40",
  },
  {
    n: "Same Day",
    label: "Fulfilment",
    bg: "radial-gradient(120% 100% at 30% 100%, hsl(300 66% 34%) 0%, hsl(300 66% 20%) 100%)",
    border: "border-fuchsia-500/40",
  },
  {
    n: "Free",
    label: "Shipping $250+",
    bg: "radial-gradient(120% 100% at 70% 100%, hsl(280 100% 40%) 0%, hsl(280 90% 24%) 100%)",
    border: "border-violet-500/40",
  },
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
                  className={`relative overflow-hidden rounded-2xl border p-8 text-white ${s.border}`}
                  style={{ background: s.bg }}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <div className="font-display text-4xl font-bold tracking-tight">
                      {s.n}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-widest opacity-85">
                      {s.label}
                    </div>
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
