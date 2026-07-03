"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { currentPromo } from "@/lib/promo";
import { useCountdownTime } from "@/hooks/use-countdown";

const COOKIE = "pl_promo_dismissed";
const DISMISS_DAYS = 1;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}
function writeCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 86_400_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function PromoModal() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const time = useCountdownTime(currentPromo.ends_at);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!currentPromo.enabled) return;
    // Only surface the interstitial when there's an actual countdown to show.
    if (!currentPromo.ends_at) return;
    if (readCookie(COOKIE) === "true") return;
    const id = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(id);
  }, []);

  function dismiss() {
    writeCookie(COOKIE, "true", DISMISS_DAYS);
    setOpen(false);
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[55] flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="surface-dark relative w-full max-w-lg overflow-hidden rounded-3xl p-8 md:p-10 shadow-2xl"
          >
            <div className="pointer-events-none absolute inset-0 opacity-50">
              <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-[80px]" />
              <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-primary/20 blur-[80px]" />
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-white/80">
                <Sparkles className="h-3 w-3 text-primary" />
                Limited time
              </div>
              <h2
                id="promo-title"
                className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Independence Event
              </h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                {currentPromo.message} Discount applied automatically at
                checkout.
              </p>

              {time && (
                <div className="mt-6 flex items-center gap-2 font-mono tabular-nums">
                  {time.days > 0 && <TimeCell v={time.days} label="Days" />}
                  <TimeCell v={time.hours} label="Hrs" />
                  <TimeCell v={time.minutes} label="Min" />
                  <TimeCell v={time.seconds} label="Sec" />
                </div>
              )}

              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={currentPromo.cta_href}
                  onClick={dismiss}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110"
                >
                  {currentPromo.cta_label} <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={dismiss}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TimeCell({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">
      <span className="text-xl font-bold leading-none">{pad(v)}</span>
      <span className="mt-1 text-[9px] uppercase tracking-widest text-white/60">
        {label}
      </span>
    </div>
  );
}
