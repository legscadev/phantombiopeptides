import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 md:p-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/25 blur-[100px]" />
            <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
          </div>
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
                Ready to order?
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Start your research with peptides you can trust.
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Same-day dispatch, third-party verified, and shipped cold-chain
                to research institutions worldwide.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/shop">
                  Browse catalog <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Talk to research team</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
