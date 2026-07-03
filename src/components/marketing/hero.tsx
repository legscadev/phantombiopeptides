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

const BADGES = [
  { n: "99%", label: "Purity" },
  { n: "3rd Party", label: "HPLC verified" },
  { n: "Same Day", label: "Fulfilment" },
  { n: "Discreet", label: "Packaging" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

// Right-column vial positions (from front-most, slightly angled, floating).
const VIAL_POSITIONS = [
  { top: "8%", right: "26%", w: "58%", rotate: -6, delay: 0.35, dur: 8 },
  { top: "0%", right: "-2%", w: "60%", rotate: 8, delay: 0.5, dur: 9 },
];

export function Hero({ vials }: HeroProps) {
  const heroVials = vials
    .slice(0, 4)
    .map((v) => ({ id: v.id, image: v.images[0] }))
    .filter((v): v is { id: number; image: NonNullable<typeof v.image> } =>
      Boolean(v.image),
    )
    .slice(0, 2);

  return (
    <section className="relative overflow-hidden bg-[#07040e] text-white">
      {/* Background: layered violet glow + faint grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 55% at 25% 45%, hsl(264 100% 22%) 0%, transparent 55%), radial-gradient(45% 45% at 82% 55%, hsl(280 90% 16%) 0%, transparent 70%), linear-gradient(180deg, #07040e 0%, #050309 100%)",
          }}
        />
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.04]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-grid"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 56 0 L 0 0 0 56"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="container-page relative z-10 grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-32">
        {/* LEFT — copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="flex flex-col justify-center"
        >
          {currentPromo.enabled && (
            <div className="mb-8 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {currentPromo.message}
            </div>
          )}

          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-[76px]">
            Research-Grade
            <br />
            Peptides.{" "}
            <span
              className="text-primary"
              style={{ color: "hsl(264 100% 68%)" }}
            >
              Zero Compromise.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">
            Every compound independently tested by ISL Labs. 99% purity,
            batch-by-batch, before every shipment. For research use only.
          </p>

          <div className="mt-10">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-full bg-white px-8 text-[#07040e] shadow-[0_20px_50px_-15px_rgba(255,255,255,0.4)] hover:bg-white/90"
            >
              <Link href="/shop">
                Shop Peptides <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Trust badges row */}
          <dl className="mt-12 grid grid-cols-2 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {BADGES.map((b) => (
              <div key={b.label}>
                <dt
                  className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
                  style={{ color: "hsl(264 100% 72%)" }}
                >
                  {b.n}
                </dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/50">
                  {b.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* RIGHT — angled vials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
          className="relative hidden min-h-[520px] lg:block"
        >
          {/* Glow halo */}
          <div
            className="absolute inset-0 blur-[110px] opacity-45"
            style={{
              background:
                "radial-gradient(circle at 60% 50%, hsl(264 100% 55%) 0%, transparent 65%)",
            }}
            aria-hidden
          />

          {heroVials.length === 0 ? null : heroVials.length === 1 ? (
            <SingleVial image={heroVials[0].image} />
          ) : (
            <>
              {heroVials.map((v, i) => {
                const cfg = VIAL_POSITIONS[i] ?? VIAL_POSITIONS[0];
                return (
                  <motion.div
                    key={v.id}
                    initial={{ opacity: 0, y: 40, rotate: cfg.rotate }}
                    animate={{ opacity: 1, y: 0, rotate: cfg.rotate }}
                    transition={{
                      duration: 1,
                      delay: cfg.delay,
                      ease: EASE,
                    }}
                    className="animate-float absolute"
                    style={{
                      top: cfg.top,
                      right: cfg.right,
                      width: cfg.w,
                      animationDelay: `${cfg.delay * 2}s`,
                      animationDuration: `${cfg.dur}s`,
                    }}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={v.image.src}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1280px) 420px, 320px"
                        className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function SingleVial({
  image,
}: {
  image: { src: string; alt: string };
}) {
  return (
    <motion.div
      animate={{ y: [0, -18, 0] }}
      transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
      className="relative mx-auto aspect-[3/4] w-full max-w-md"
    >
      <Image
        src={image.src}
        alt={image.alt || ""}
        fill
        priority
        sizes="(min-width: 1280px) 480px, 360px"
        className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
      />
    </motion.div>
  );
}
