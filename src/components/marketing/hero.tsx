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
import type { WCProduct } from "@/types";

interface HeroProps {
  vials: WCProduct[];
}

const badges = [
  { icon: ShieldCheck, label: "99%+ Purity" },
  { icon: FlaskConical, label: "3rd-party lab tested" },
  { icon: Sparkles, label: "Same-day dispatch" },
  { icon: Truck, label: "Discreet shipping" },
];

// Stable orbit positions (percent). No Math.random → SSR-safe.
const ORBITS = [
  { top: "6%", left: "6%", size: 120, delay: 0 },
  { top: "18%", left: "82%", size: 96, delay: 0.15 },
  { top: "58%", left: "3%", size: 88, delay: 0.3 },
  { top: "70%", left: "84%", size: 108, delay: 0.45 },
  { top: "38%", left: "-2%", size: 72, delay: 0.6 },
  { top: "34%", left: "92%", size: 68, delay: 0.75 },
];

export function Hero({ vials }: HeroProps) {
  const orbitVials = vials.slice(0, ORBITS.length);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/12 blur-[140px]" />
        <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Floating product orbits — only shown on lg+ so mobile stays clean */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block">
        {orbitVials.map((product, i) => {
          const cfg = ORBITS[i];
          const img = product.images[0];
          if (!img) return null;
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.9,
                delay: cfg.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute"
              style={{ top: cfg.top, left: cfg.left }}
            >
              <div
                className="animate-float"
                style={{
                  animationDelay: `${cfg.delay * 2}s`,
                  animationDuration: `${8 + i}s`,
                }}
              >
                <div
                  className="relative overflow-hidden rounded-2xl border border-border/60 bg-background-elevated/60 backdrop-blur"
                  style={{ width: cfg.size, height: cfg.size }}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="container-page pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-5xl font-semibold tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-[80px] lg:leading-[1]"
          >
            Research-grade peptides.
            <br />
            <span className="gradient-text">Zero compromise.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground text-pretty leading-relaxed"
          >
            Every compound independently tested. 99%+ purity, verified
            by third-party HPLC before every shipment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/shop">
                Shop all peptides <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/coa">View COA library</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-14 flex items-center gap-6 text-xs text-muted-foreground"
          >
            <Stat n="10,000+" label="Orders shipped" />
            <Divider />
            <Stat n="99.4%" label="Avg. purity" />
            <Divider />
            <Stat n="4.9★" label="Rating" />
          </motion.div>
        </div>
      </div>
    </section>
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

function Divider() {
  return <span className="h-6 w-px bg-border" aria-hidden />;
}
