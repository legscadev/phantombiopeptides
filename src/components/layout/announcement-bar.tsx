"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { currentPromo } from "@/lib/promo";
import { useCountdownTime } from "@/hooks/use-countdown";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function AnnouncementBar() {
  const time = useCountdownTime(currentPromo.ends_at);
  if (!currentPromo.enabled) return null;

  return (
    <div className="surface-dark relative overflow-hidden">
      <div className="container-page">
        <div className="flex h-10 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/85">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={2.4} />
            <span className="font-medium">{currentPromo.message}</span>
          </span>

          {time && (
            <span className="inline-flex items-center gap-1.5">
              <span className="hidden text-white/60 sm:inline">Ends in</span>
              <span className="inline-flex items-center gap-1 font-mono tabular-nums text-white">
                {time.days > 0 && (
                  <>
                    <TimeCell v={time.days} label="d" />
                    <span className="opacity-40">·</span>
                  </>
                )}
                <TimeCell v={time.hours} label="h" />
                <span className="opacity-40">·</span>
                <TimeCell v={time.minutes} label="m" />
                <span className="opacity-40">·</span>
                <TimeCell v={time.seconds} label="s" />
              </span>
            </span>
          )}

          <Link
            href={currentPromo.cta_href}
            className="hidden items-center gap-1 rounded-md bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground hover:brightness-110 sm:inline-flex"
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
      <span className="ml-0.5 text-[10px] text-white/50">{label}</span>
    </span>
  );
}
