"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [ageChecked, setAgeChecked] = React.useState(false);
  const [researcherChecked, setResearcherChecked] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (readCookie(COOKIE) !== "true") {
      setOpen(true);
    }
  }, []);

  const canEnter = ageChecked && researcherChecked;

  function confirm() {
    if (!canEnter) return;
    writeCookie(COOKIE, "true");
    setOpen(false);
  }

  function decline() {
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
          className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 p-4 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
        >
          <div className="flex w-full max-w-lg flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong relative w-full overflow-hidden rounded-3xl p-8 md:p-10"
            >
              <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background-elevated text-primary">
                  <ShieldAlert className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h2
                  id="age-gate-title"
                  className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
                >
                  Researcher verification
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Phantom Bio Peptides sells research compounds exclusively to
                  qualified researchers and laboratories for in-vitro and
                  laboratory use. Please confirm before continuing.
                </p>

                <div className="mt-6 space-y-3">
                  <CheckboxRow
                    checked={ageChecked}
                    onToggle={() => setAgeChecked((v) => !v)}
                    id="age-gate-age"
                  >
                    I am at least <strong className="text-foreground">21 years of age</strong>.
                  </CheckboxRow>
                  <CheckboxRow
                    checked={researcherChecked}
                    onToggle={() => setResearcherChecked((v) => !v)}
                    id="age-gate-researcher"
                  >
                    I confirm I am a{" "}
                    <strong className="text-foreground">
                      qualified researcher
                    </strong>{" "}
                    purchasing for{" "}
                    <strong className="text-foreground">
                      in-vitro / laboratory research
                    </strong>{" "}
                    only — not for human or veterinary use.
                  </CheckboxRow>
                </div>

                <Button
                  size="lg"
                  onClick={confirm}
                  disabled={!canEnter}
                  className="mt-6 w-full"
                >
                  Enter Phantom Bio Peptides
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="mt-5 text-[11px] leading-relaxed text-muted-foreground">
                  By proceeding you affirm the statements above are true.
                  Products are not for human or veterinary use, not for use in
                  diagnostic procedures, and have not been evaluated by the
                  U.S. Food and Drug Administration.
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xs text-muted-foreground"
            >
              Not a researcher?{" "}
              <button
                type="button"
                onClick={decline}
                className="font-medium text-foreground underline underline-offset-2 hover:text-[color:hsl(var(--brand-500))]"
              >
                Exit
              </button>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CheckboxRow({
  checked,
  onToggle,
  id,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all",
        checked
          ? "border-[color:hsl(var(--brand-500))]/60 bg-[color:hsl(var(--brand-50))]/70"
          : "border-border bg-background-elevated hover:border-border-strong",
      )}
    >
      <button
        type="button"
        role="checkbox"
        id={id}
        aria-checked={checked}
        onClick={onToggle}
        className={cn(
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2",
          checked
            ? "border-[color:hsl(var(--brand-500))] bg-[color:hsl(var(--brand-500))] text-white"
            : "border-border bg-background",
        )}
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </button>
      <span className="text-sm leading-relaxed text-foreground/85">
        {children}
      </span>
    </label>
  );
}
