import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";

export function CtaSection() {
  return (
    <section className="py-20 md:py-24">
      <div className="container-page">
        <Reveal>
        <div
          className="surface-dark relative overflow-hidden rounded-2xl px-8 py-14 text-center md:px-16 md:py-20"
          style={{
            background:
              "radial-gradient(70% 100% at 50% 0%, hsl(264 100% 22%) 0%, hsl(224 47% 8%) 70%)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/40 blur-[100px]" />
            <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "hsl(264 100% 72%)" }}>
              Ready to elevate your research?
            </p>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Start with peptides you can trust.
            </h3>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">
              Same-day fulfilment. Independently verified by ISL Labs.
              Discreet packaging. Free shipping over $250.
            </p>
            <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                asChild
                className="bg-white text-[hsl(264_100%_30%)] hover:bg-white/90 hover:brightness-100"
              >
                <Link href="/shop">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
