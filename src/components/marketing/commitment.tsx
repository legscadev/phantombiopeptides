import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";

/**
 * "Never Sell a Batch Without Proof" — left glass panel with headline + copy,
 * right column is a 2x2 grid of glass stat tiles with brand-gradient
 * numbers.
 */
const STATS = [
  { n: "99%+", label: "Avg. purity" },
  { n: "100%", label: "Batches tested" },
  { n: "Same Day", label: "Fulfilment" },
  { n: "Free", label: "Shipping $125+" },
];

export function Commitment() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
            <div className="glass ring-glass rounded-3xl p-8 md:p-12">
              <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                <span className="h-px w-6 bg-[color:hsl(var(--brand-500))]/50" />
                Our commitment
              </p>
              <h2 className="mt-4 max-w-lg font-display font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl text-balance">
                Phantom Bio never ships a batch without{" "}
                <span className="text-brand-gradient">proof of purity.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Every product is independently tested by ISL Labs before it
                leaves our facility. A lot-specific Certificate of Analysis
                ships in every box.
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/about">
                    Our Story <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.06}>
                  <div className="glass ring-glass group h-full rounded-3xl p-6 md:p-8 transition-transform duration-500 hover:-translate-y-1">
                    <div className="text-brand-gradient font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                      {s.n}
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
