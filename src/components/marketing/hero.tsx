"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Truck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentPromo } from "@/lib/promo";
import { useCountdownTime } from "@/hooks/use-countdown";
import type { WCProduct } from "@/types";

interface HeroProps {
  vials: WCProduct[];
}

const badges = [
  { icon: ShieldCheck, label: "99% Purity Guaranteed" },
  { icon: FlaskConical, label: "3rd Party Lab Tested" },
  { icon: Sparkles, label: "Same Day Fulfilment" },
  { icon: Truck, label: "Discreet Packaging" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Hero({ vials }: HeroProps) {
  const time = useCountdownTime(currentPromo.ends_at);
  const heroVials = vials.slice(0, 5);

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          {/* Violet focal card — EVO's Independence Event style, in Phantom violet */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 px-6 py-12 md:px-14 md:py-16"
            style={{
              background:
                "radial-gradient(120% 100% at 30% 0%, hsl(264 100% 34% / 0.55) 0%, hsl(262 90% 18% / 0.9) 40%, hsl(0 0% 4%) 100%)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/40 blur-[100px]" />
              <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/25 blur-[100px]" />
            </div>

            <div className="relative flex flex-col items-center text-center">
              {currentPromo.enabled && (
                <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/85 backdrop-blur">
                  <Sparkles className="h-3 w-3 text-white" />
                  {currentPromo.message}
                </div>
              )}

              <h1 className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px]">
                The Next Evolution
                <br />
                Is <span className="text-white/60 italic">Unseen.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm text-white/70 leading-relaxed sm:text-base">
                Research-use peptides, independently verified. 99% purity
                minimum, tested batch-by-batch by ISL Labs.
              </p>

              {time && (
                <div className="mt-8 flex items-center gap-2 font-mono tabular-nums text-white">
                  {time.days > 0 && <TimeCell v={time.days} label="Days" />}
                  <TimeCell v={time.hours} label="Hrs" />
                  <TimeCell v={time.minutes} label="Min" />
                  <TimeCell v={time.seconds} label="Sec" />
                </div>
              )}

              <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row">
                <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 hover:brightness-100">
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

              {heroVials.length > 0 && (
                <div className="mt-12 flex w-full items-end justify-center gap-2 md:gap-3">
                  {heroVials.map((p, i) => {
                    const img = p.images[0];
                    if (!img) return null;
                    return (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.7,
                          delay: 0.4 + i * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md border border-white/15 bg-white/5 backdrop-blur sm:w-20 md:w-24"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt || p.name}
                          fill
                          sizes="120px"
                          className="object-cover"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Trust badges strip under the card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
                {label}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
          >
            <Stat n="10,000+" label="Orders shipped" />
            <span className="h-6 w-px bg-border" aria-hidden />
            <Stat n="99.4%" label="Avg. purity" />
            <span className="h-6 w-px bg-border" aria-hidden />
            <Stat n="4.9★" label="Rating" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TimeCell({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur">
      <span className="text-2xl font-bold leading-none">{pad(v)}</span>
      <span className="mt-1 text-[9px] uppercase tracking-widest text-white/70">
        {label}
      </span>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-mono text-base font-semibold text-foreground">
        {n}
      </div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
