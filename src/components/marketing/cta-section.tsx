import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <div className="surface-dark relative overflow-hidden rounded-3xl p-10 md:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-[100px]" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
          </div>
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
                Ready to order?
              </p>
              <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Start your research with peptides you can trust.
              </h3>
              <p className="mt-4 text-sm text-white/70 leading-relaxed">
                Same-day fulfilment. Independently verified by ISL Labs.
                Discreet packaging. Free shipping over $250.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/shop">
                  Shop peptides <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/coa">View COA library</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
