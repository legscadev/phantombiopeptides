"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentPromo } from "@/lib/promo";
import type { WCProduct } from "@/types";

interface HeroProps {
  vials: WCProduct[];
}

const TRUST = [
  "99% Purity Guaranteed",
  "3rd-Party Lab Tested",
  "Same-Day Fulfilment",
  "Discreet Packaging",
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ vials }: HeroProps) {
  const heroProduct = vials[0];

  return (
    <section className="relative -mt-px flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden bg-[#07040e] text-white lg:min-h-[calc(100vh-4rem)]">
      {/* Background: layered radial gradients for a deep, expensive-looking glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 55% at 22% 38%, hsl(264 100% 22%) 0%, transparent 55%), radial-gradient(45% 45% at 82% 68%, hsl(280 85% 14%) 0%, transparent 70%), linear-gradient(180deg, #07040e 0%, #050309 100%)",
          }}
        />
        {/* Fine grid overlay */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.035]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
        {/* Top fade so navbar area breathes */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />
        {/* Bottom fade into trust bar */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="container-page relative z-10 grid gap-14 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-0">
        {/* LEFT — editorial copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="flex flex-col justify-center"
        >
          {currentPromo.enabled && (
            <div className="mb-10 inline-flex w-fit items-center gap-3 border-l border-primary/70 pl-3 text-[10px] uppercase tracking-[0.28em] text-white/60">
              {currentPromo.message}
            </div>
          )}

          <p className="text-[11px] uppercase tracking-[0.32em] text-white/45">
            Research-grade &nbsp;·&nbsp; HPLC verified
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] font-light leading-[0.98] tracking-[-0.02em] text-white">
            Precision
            <br />
            <span className="italic font-normal text-white/85">peptides,</span>
            <br />
            uncompromised.
          </h1>

          <p className="mt-8 max-w-md text-base leading-relaxed text-white/60">
            Every compound tested independently by ISL Labs. 99% purity,
            batch-by-batch, before a single vial leaves the facility.
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-none bg-white px-8 text-[#07040e] shadow-[0_20px_50px_-20px_rgba(255,255,255,0.6)] hover:bg-white/90"
            >
              <Link href="/shop">
                Shop the catalog <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Link
              href="/coa"
              className="text-xs uppercase tracking-[0.24em] text-white/60 underline decoration-white/20 underline-offset-8 transition hover:text-white hover:decoration-white/60"
            >
              View COA library
            </Link>
          </div>
        </motion.div>

        {/* RIGHT — hero product */}
        {heroProduct?.images[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="relative hidden items-center lg:flex"
          >
            {/* Glow halo behind the vial */}
            <div
              className="absolute inset-0 -m-16 opacity-50 blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle at 55% 45%, hsl(264 100% 55%) 0%, transparent 60%)",
              }}
              aria-hidden
            />
            <div className="relative w-full">
              <motion.div
                animate={{ y: [0, -18, 0] }}
                transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
                className="relative mx-auto aspect-[3/4] w-full max-w-[520px]"
              >
                <Image
                  src={heroProduct.images[0].src}
                  alt={heroProduct.name}
                  fill
                  priority
                  sizes="(min-width: 1280px) 520px, 420px"
                  className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9, ease: EASE }}
                className="mt-10 flex items-center justify-between border-t border-white/10 pt-5"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                    Featured
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    {heroProduct.name}
                  </p>
                </div>
                <Link
                  href={`/product/${heroProduct.slug}`}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/60 transition hover:text-white"
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom trust strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/25 backdrop-blur-sm"
      >
        <div className="container-page py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[10px] uppercase tracking-[0.28em] text-white/55">
            {TRUST.map((t, i) => (
              <span key={t} className="flex items-center gap-10">
                {t}
                {i < TRUST.length - 1 && (
                  <span className="text-white/20" aria-hidden>
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
