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

export function Hero({ vials }: HeroProps) {
  const heroImage = vials[0]?.images[0];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60">
        <div className="absolute left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[140px]" />
        <div className="absolute right-0 top-40 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]" />
      </div>

      <div className="container-page py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            {currentPromo.enabled && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="mb-6 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary"
              >
                <Sparkles className="h-3 w-3" />
                {currentPromo.message}
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-[80px]"
            >
              The Next
              <br />
              Evolution
              <br />
              Is <span className="text-primary">Unseen.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15 }}
              className="mt-6 max-w-lg text-base text-muted-foreground leading-relaxed"
            >
              Research-use peptides, independently verified. 99% purity
              minimum, tested batch-by-batch by ISL Labs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.3 }}
              className="mt-8 flex flex-col gap-2 sm:flex-row"
            >
              <Button size="lg" asChild>
                <Link href="/shop">
                  Shop Peptides <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/coa">View COA library</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2"
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
          </div>

          {heroImage && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-md border border-border bg-background-elevated"
            >
              <Image
                src={heroImage.src}
                alt={heroImage.alt || vials[0].name}
                fill
                priority
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
