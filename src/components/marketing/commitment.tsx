import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";

const STATS = [
  { n: "99.4%", label: "Avg. purity" },
  { n: "100%", label: "Batches tested" },
  { n: "Same-day", label: "Fulfillment" },
  { n: "$150+", label: "Free shipping" },
];

export function Commitment() {
  return (
    <section className="py-24">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/25 blur-[100px]" />
              <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-accent/15 blur-[100px]" />
            </div>
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
                Our commitment
              </p>
              <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                We never sell research compounds without proof of purity.
              </h2>
              <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
                Every product is independently tested before it leaves our
                facility. COAs are published to our library on the same day
                the batch is released — before you place your order. If we
                can&apos;t verify it, we don&apos;t sell it.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                      {s.n}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-2 sm:flex-row">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
