"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { currentPromo } from "@/lib/promo";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function useCountdown(target: string | null) {
  const [remaining, setRemaining] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!target) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemaining(null);
      return;
    }
    const end = new Date(target).getTime();
    function tick() {
      setRemaining(Math.max(0, end - Date.now()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (remaining === null || remaining <= 0) return null;
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function AnnouncementBar() {
  const time = useCountdown(currentPromo.ends_at);
  if (!currentPromo.enabled) return null;

  return (
    <div className="relative overflow-hidden border-b border-border/50 bg-background/60">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      <div className="container-page relative">
        <div className="flex h-10 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
            <span className="font-medium">{currentPromo.message}</span>
          </span>

          {time && (
            <span className="inline-flex items-center gap-1.5">
              <span className="hidden text-muted-foreground sm:inline">
                Ends in
              </span>
              <span className="inline-flex items-center gap-0.5 font-mono tabular-nums text-foreground">
                {time.days > 0 && (
                  <>
                    <TimeCell v={time.days} label="d" />
                    <span className="opacity-50">·</span>
                  </>
                )}
                <TimeCell v={time.hours} label="h" />
                <span className="opacity-50">·</span>
                <TimeCell v={time.minutes} label="m" />
                <span className="opacity-50">·</span>
                <TimeCell v={time.seconds} label="s" />
              </span>
            </span>
          )}

          <Link
            href={currentPromo.cta_href}
            className="hidden items-center gap-1 text-primary hover:underline sm:inline-flex"
          >
            {currentPromo.cta_label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function TimeCell({ v, label }: { v: number; label: string }) {
  return (
    <span className="inline-flex items-baseline">
      <span>{pad(v)}</span>
      <span className="ml-0.5 text-[10px] text-muted-foreground">{label}</span>
    </span>
  );
}
