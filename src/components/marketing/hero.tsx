"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FlaskConical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  { icon: ShieldCheck, label: "HPLC ≥99% verified" },
  { icon: FlaskConical, label: "Third-party tested" },
  { icon: Sparkles, label: "Cold-chain shipping" },
];

// Precomputed particles so the SVG stays deterministic. Values are rounded
// to avoid float-precision drift between Node and V8 that would trip React's
// hydration check.
const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const PARTICLES = Array.from({ length: 40 }).map((_, i) => ({
  cx: 100 + (i * 27) % 1000,
  cy: round(100 + Math.sin(i) * 200 + 200),
  r: round(2 + ((i * 17) % 10) / 5),
  opacity: round(0.3 + ((i * 13) % 10) / 15, 3),
}));

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="container-page pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-balance text-5xl font-semibold tracking-[-0.03em] sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[1]"
          >
            Research-grade peptides,
            <br />
            <span className="gradient-text">engineered for clarity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed"
          >
            Phantom Labs supplies HPLC-verified research compounds with
            transparent COAs, cold-chain fulfillment, and full lot
            traceability — trusted by research institutions worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button size="lg" asChild>
              <Link href="/shop">
                Browse catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/quality">See our testing process</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
          >
            {badges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="relative mx-auto mt-20 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl gradient-border">
            <div className="aspect-[16/9] bg-gradient-to-br from-background-elevated via-background to-background-elevated">
              <div className="absolute inset-0 opacity-70">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 1200 675"
                  fill="none"
                  aria-hidden
                >
                  <defs>
                    <radialGradient
                      id="glow"
                      cx="50%"
                      cy="50%"
                      r="50%"
                    >
                      <stop
                        offset="0%"
                        stopColor="hsl(258 90% 60%)"
                        stopOpacity="0.6"
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(258 90% 60%)"
                        stopOpacity="0"
                      />
                    </radialGradient>
                  </defs>
                  <circle cx="600" cy="337" r="200" fill="url(#glow)" />
                  {PARTICLES.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.cx}
                      cy={p.cy}
                      r={p.r}
                      fill="hsl(190 95% 60%)"
                      opacity={p.opacity}
                    />
                  ))}
                </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-strong rounded-2xl px-8 py-6 text-left">
                  <div className="flex items-center text-xs">
                    <span className="text-muted-foreground uppercase tracking-widest">
                      Lot #BPC-24118-A
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-8 text-xs">
                    <div>
                      <div className="text-muted-foreground">Purity</div>
                      <div className="mt-1 text-xl font-semibold text-foreground">
                        99.4%
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Molecular wt.</div>
                      <div className="mt-1 text-xl font-semibold text-foreground">
                        1419.6
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tested</div>
                      <div className="mt-1 text-xl font-semibold text-foreground">
                        11/24
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
