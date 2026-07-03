"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE = "pl_age_confirmed";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)"),
  );
  return match ? decodeURIComponent(match[2]) : null;
}

function writeCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function AgeGate() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (readCookie(COOKIE) !== "true") {
      setOpen(true);
    }
  }, []);

  function confirm() {
    writeCookie(COOKIE, "true");
    setOpen(false);
  }

  function decline() {
    // Redirect away — we cannot legally serve content.
    window.location.replace("https://www.google.com");
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/85 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative w-full max-w-lg overflow-hidden rounded-3xl p-8 md:p-10"
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-primary">
                Restricted content
              </p>
              <h2
                id="age-gate-title"
                className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Are you 21 or older?
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                All products offered are strictly for laboratory research and
                in-vitro use. By continuing you confirm that you are at least
                21 years of age and understand these materials are{" "}
                <strong className="text-foreground">
                  not intended for human consumption, therapeutic use, or
                  diagnostic applications
                </strong>
                .
              </p>
              <div className="mt-8 flex flex-col gap-2 sm:flex-row-reverse">
                <Button size="lg" onClick={confirm} className="flex-1">
                  I am 21 or older
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={decline}
                  className="flex-1"
                >
                  Leave site
                </Button>
              </div>
              <p className="mt-5 text-center text-[11px] text-muted-foreground">
                Your confirmation is stored for 30 days.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
