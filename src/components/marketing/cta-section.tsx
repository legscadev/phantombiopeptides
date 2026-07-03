import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-3xl border border-primary/40 p-10 md:p-16"
          style={{
            background:
              "radial-gradient(120% 100% at 30% 0%, hsl(264 100% 38%) 0%, hsl(262 80% 20%) 40%, hsl(0 0% 6%) 100%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-[100px]" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[100px]" />
          </div>
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/80">
                Ready to elevate your research?
              </p>
              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Start with peptides you can trust.
              </h3>
              <p className="mt-4 text-sm text-white/75 leading-relaxed">
                Same-day fulfilment. Independently verified by ISL Labs.
                Discreet packaging. Free shipping over $250.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90 hover:brightness-100"
              >
                <Link href="/shop">
                  Shop Peptides <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 bg-white/5 text-white hover:border-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/coa">View COA Library</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
