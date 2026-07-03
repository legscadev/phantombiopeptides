"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FlaskConical, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentPromo } from "@/lib/promo";
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

// Positions for vials scattered across the hero card (percentages).
const LEFT_VIALS = [
  { top: "8%", left: "6%", w: 90, rotate: -8, delay: 0.2 },
  { top: "38%", left: "-2%", w: 110, rotate: 12, delay: 0.35 },
  { top: "62%", left: "10%", w: 84, rotate: -6, delay: 0.5 },
];
const RIGHT_VIALS = [
  { top: "10%", right: "4%", w: 100, rotate: 10, delay: 0.25 },
  { top: "44%", right: "-4%", w: 120, rotate: -8, delay: 0.4 },
  { top: "68%", right: "12%", w: 82, rotate: 6, delay: 0.55 },
];

// Deterministic sparkle positions — no Math.random at render (SSR-safe).
const SPARKLES = Array.from({ length: 60 }).map((_, i) => ({
  x: (i * 91) % 100,
  y: (i * 47) % 100,
  r: 1 + ((i * 7) % 3),
  c: i % 3 === 0 ? "#c084fc" : i % 3 === 1 ? "#60a5fa" : "#f472b6",
  o: 0.35 + ((i * 11) % 60) / 100,
}));

export function Hero({ vials }: HeroProps) {
  const leftVials = vials.slice(0, 3);
  const rightVials = vials.slice(3, 6);

  return (
    <section className="relative overflow-hidden py-8 md:py-12">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl surface-dark"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, hsl(264 100% 20%) 0%, hsl(224 47% 8%) 55%, hsl(224 47% 5%) 100%)",
          }}
        >
          {/* Sparkles / confetti — EVO uses star confetti */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {SPARKLES.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r * 0.15}
                fill={s.c}
                opacity={s.o}
              />
            ))}
          </svg>

          {/* Left vial cluster */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 md:block">
            {leftVials.map((v, i) => {
              const cfg = LEFT_VIALS[i];
              const img = v.images[0];
              if (!img) return null;
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 40, rotate: cfg.rotate }}
                  animate={{ opacity: 1, y: 0, rotate: cfg.rotate }}
                  transition={{
                    duration: 0.9,
                    delay: cfg.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="animate-float absolute"
                  style={{
                    top: cfg.top,
                    left: cfg.left,
                    width: cfg.w,
                    animationDelay: `${cfg.delay * 3}s`,
                    animationDuration: `${8 + i}s`,
                  }}
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/15 bg-white/10 backdrop-blur"
                    style={{
                      boxShadow:
                        "0 20px 40px -20px rgba(0,0,0,0.6), 0 0 40px -10px hsl(264 100% 40% / 0.4)",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right vial cluster */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 md:block">
            {rightVials.map((v, i) => {
              const cfg = RIGHT_VIALS[i];
              const img = v.images[0];
              if (!img) return null;
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 40, rotate: cfg.rotate }}
                  animate={{ opacity: 1, y: 0, rotate: cfg.rotate }}
                  transition={{
                    duration: 0.9,
                    delay: cfg.delay,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="animate-float absolute"
                  style={{
                    top: cfg.top,
                    right: cfg.right,
                    width: cfg.w,
                    animationDelay: `${cfg.delay * 3}s`,
                    animationDuration: `${9 + i}s`,
                  }}
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/15 bg-white/10 backdrop-blur"
                    style={{
                      boxShadow:
                        "0 20px 40px -20px rgba(0,0,0,0.6), 0 0 40px -10px hsl(264 100% 40% / 0.4)",
                    }}
                  >
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Center content */}
          <div className="relative flex flex-col items-center px-6 py-14 text-center md:px-10 md:py-20">
            {currentPromo.enabled && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/90 backdrop-blur">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
                {currentPromo.message}
              </div>
            )}

            <h1 className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[68px]">
              Research-Grade Peptides.
              <br />
              <span className="text-primary" style={{ color: "hsl(264 100% 68%)" }}>
                Zero Compromise.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm text-white/70 leading-relaxed sm:text-base">
              Every compound independently tested by ISL Labs. 99% purity,
              batch-by-batch, before every shipment.
            </p>

            <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-white text-[hsl(264_100%_30%)] hover:bg-white/90 hover:brightness-100"
              >
                <Link href="/shop">
                  Shop All Peptides <ArrowRight className="h-4 w-4" />
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

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {badges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-white/70"
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    strokeWidth={2.4}
                    style={{ color: "hsl(264 100% 72%)" }}
                  />
                  {label}
                </div>
              ))}
            </div>
          </div>
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
