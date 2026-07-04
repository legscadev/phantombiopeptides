import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/reveal";

const TRUST = [
  { icon: ShieldCheck, label: "99% HPLC verified" },
  { icon: FileCheck, label: "COA in every box" },
  { icon: Truck, label: "Same-day fulfilment" },
];

export function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <div className="bg-ambient-dark ring-glass-dark relative overflow-hidden rounded-[32px] px-8 py-16 text-center md:px-16 md:py-24">
            {/* Drifting brand blob */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div
                className="animate-blob absolute -left-24 top-6 h-[420px] w-[420px] rounded-full opacity-70 blur-[120px]"
                style={{
                  background:
                    "radial-gradient(circle, #4900AD 0%, transparent 65%)",
                }}
              />
              <div
                className="animate-blob absolute -right-16 bottom-0 h-[360px] w-[360px] rounded-full opacity-50 blur-[110px]"
                style={{
                  background:
                    "radial-gradient(circle, #7433FF 0%, transparent 70%)",
                  animationDelay: "-8s",
                }}
              />
              <div className="bg-grid-dark absolute inset-0 opacity-50" />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-300))]">
                <span className="h-px w-6 bg-[color:hsl(var(--brand-300))]/60" />
                Ready to elevate your research?
              </p>
              <h3 className="mt-4 font-display font-extrabold tracking-tight text-3xl sm:text-4xl md:text-5xl text-balance text-white">
                Start with peptides you can{" "}
                <span className="text-brand-gradient">trust.</span>
              </h3>
              <p className="mt-5 text-base leading-relaxed text-white/70">
                Same-day fulfilment. Independently verified by ISL Labs.
                Discreet packaging. Free shipping over $250.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  size="lg"
                  asChild
                  className="h-12 rounded-full bg-white px-8 text-[#060606] shadow-[0_20px_50px_-15px_rgba(255,255,255,0.5)] hover:bg-white/90"
                >
                  <Link href="/shop">
                    Shop peptides <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-300))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
                >
                  Learn our story <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Trust ticker */}
              <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.22em] text-white/60">
                {TRUST.map((t) => (
                  <li key={t.label} className="inline-flex items-center gap-2">
                    <t.icon
                      className="h-3.5 w-3.5 text-[color:hsl(var(--brand-300))]"
                      strokeWidth={2.2}
                    />
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
