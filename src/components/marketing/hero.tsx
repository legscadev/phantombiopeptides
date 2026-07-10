"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentPromo } from "@/lib/promo";

const HERO_VIALS = [
  {
    src: "https://i0.wp.com/kickbackai-pkjdo.wpcomstaging.com/wp-content/uploads/2026/06/27.png?w=1600&ssl=1",
    alt: "Tirzepatide 10 mg — Phantom Bio Labs",
  },
  {
    src: "/hero-vial-packaging.png",
    alt: "Phantom Bio Peptides — packaged research vials",
  },
];

const BADGES = [
  { n: "99%", label: "Purity" },
  { n: "3rd Party", label: "HPLC verified" },
  { n: "Same Day", label: "Fulfilment" },
  { n: "Discreet", label: "Packaging" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="bg-ambient-dark relative flex min-h-svh items-center overflow-hidden text-white">
      {/* Ambient blobs — drift slowly */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="animate-blob absolute -left-24 top-16 h-[520px] w-[520px] rounded-full opacity-70 blur-[120px]"
          style={{ background: "radial-gradient(circle, #4900AD 0%, transparent 65%)" }}
        />
        <div
          className="animate-blob absolute right-[-8rem] top-40 h-[420px] w-[420px] rounded-full opacity-50 blur-[110px]"
          style={{ background: "radial-gradient(circle, #7433FF 0%, transparent 70%)", animationDelay: "-6s" }}
        />
        <div
          className="animate-blob absolute -bottom-24 left-1/3 h-[380px] w-[380px] rounded-full opacity-40 blur-[100px]"
          style={{ background: "radial-gradient(circle, #A879FF 0%, transparent 70%)", animationDelay: "-11s" }}
        />
        {/* Fine grid — barely visible */}
        <div className="bg-grid-dark absolute inset-0 opacity-60" />
      </div>

      <div className="container-page relative z-10 grid gap-14 py-20 md:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:py-36">
        {/* LEFT — copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="flex flex-col justify-center"
        >
          {currentPromo.enabled ? (
            <div className="glass-dark mb-8 inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/80">
              <Sparkles className="h-3 w-3 text-[color:hsl(var(--brand-300))]" />
              {currentPromo.message}
            </div>
          ) : (
            <div className="glass-dark mb-8 inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/80">
              <ShieldCheck className="h-3 w-3 text-[color:hsl(var(--brand-300))]" />
              99% HPLC verified · ISL Labs certified
            </div>
          )}

          <h1 className="font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.02em] text-white sm:text-6xl lg:text-[80px]">
            Research-Grade
            <br />
            Peptides.{" "}
            <span className="text-brand-gradient">Zero Compromise.</span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            Every compound independently tested by ISL Labs. 99% purity,
            batch-by-batch, before every shipment leaves the facility.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-full bg-white px-8 text-[#060606] shadow-[0_20px_50px_-15px_rgba(255,255,255,0.5)] hover:bg-white/90"
            >
              <Link href="/shop">
                Shop peptides <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-12 rounded-full border border-white/20 bg-white/[0.04] px-6 text-white backdrop-blur hover:bg-white/[0.08] hover:text-white"
            >
              <Link href="/about">Our story</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <dl className="mt-14 grid grid-cols-2 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {BADGES.map((b, i) => (
              <motion.div
                key={b.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 + i * 0.08, ease: EASE }}
              >
                <dt className="text-brand-gradient font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {b.n}
                </dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/55">
                  {b.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        {/* RIGHT — two overlapping hero vials in a glass stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE }}
          className="relative hidden lg:block"
        >
          {/* Glass stage container — provides the frame that makes the vials feel presented */}
          <div className="relative mx-auto aspect-square w-full max-w-[600px]">
            {/* Large halo behind the pair */}
            <div
              className="absolute inset-0 -m-10 opacity-70 blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 55%, #7433FF 0%, transparent 60%)",
              }}
              aria-hidden
            />

            {/* Faint floating glass panel behind the vials */}
            <div
              className="glass-dark absolute inset-[8%] rounded-[36px]"
              aria-hidden
            />

            {/* Back vial — Tirzepatide */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 8 }}
              animate={{ opacity: 1, y: 0, rotate: 8 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
              className="animate-float absolute right-[4%] top-[2%] w-[68%]"
              style={{ animationDelay: "1.2s", animationDuration: "9s" }}
            >
              <div className="relative aspect-square">
                <Image
                  src={HERO_VIALS[0].src}
                  alt={HERO_VIALS[0].alt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 380px, 300px"
                  className="object-contain drop-shadow-[0_30px_50px_rgba(0,0,0,0.7)]"
                />
              </div>
            </motion.div>

            {/* Front vial — GLP-3 */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: -14 }}
              animate={{ opacity: 1, y: 0, rotate: -14 }}
              transition={{ duration: 1, delay: 0.55, ease: EASE }}
              className="animate-float absolute bottom-[2%] left-[2%] w-[78%]"
              style={{ animationDuration: "8s" }}
            >
              <div className="relative aspect-square">
                <Image
                  src={HERO_VIALS[1].src}
                  alt={HERO_VIALS[1].alt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 440px, 340px"
                  className="object-contain drop-shadow-[0_45px_60px_rgba(0,0,0,0.75)]"
                />
              </div>
            </motion.div>

            {/* Corner detail — floating spec chip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
              className="glass-dark absolute -right-2 top-6 rounded-2xl px-4 py-3"
            >
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/50">
                Purity
              </p>
              <p className="text-brand-gradient font-display text-2xl font-bold leading-tight">
                ≥ 99.4%
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
