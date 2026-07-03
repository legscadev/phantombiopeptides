"use client";

import * as React from "react";
import { cn, formatPrice } from "@/lib/utils";

interface Tier {
  qty: number;
  save: number; // fractional discount, e.g. 0.05 for 5%
  label?: string;
}

const DEFAULT_TIERS: Tier[] = [
  { qty: 1, save: 0 },
  { qty: 2, save: 0.05 },
  { qty: 3, save: 0.1, label: "Best value" },
];

interface Props {
  basePrice: number;
  value: number;
  onChange: (qty: number) => void;
  currency?: string;
  perUnitLabel?: string;
  tiers?: Tier[];
}

export function TieredPricing({
  basePrice,
  value,
  onChange,
  currency = "USD",
  perUnitLabel = "vial",
  tiers = DEFAULT_TIERS,
}: Props) {
  if (!Number.isFinite(basePrice) || basePrice <= 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Buy more, save more
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {tiers.map((t) => {
          const total = basePrice * t.qty * (1 - t.save);
          const perUnit = total / t.qty;
          const active = value === t.qty;
          return (
            <button
              key={t.qty}
              type="button"
              onClick={() => onChange(t.qty)}
              className={cn(
                "relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all",
                active
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background-elevated hover:border-border-strong",
              )}
            >
              {t.label && (
                <span className="absolute -top-2 right-3 rounded-full border border-primary/40 bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
                  {t.label}
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-semibold text-foreground">
                  {t.qty}
                </span>
                <span className="text-xs text-muted-foreground">
                  {perUnitLabel}
                  {t.qty === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-1 font-mono text-sm text-foreground">
                {formatPrice(total, currency)}
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                {formatPrice(perUnit, currency)} / {perUnitLabel}
              </div>
              {t.save > 0 && (
                <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-primary">
                  Save {Math.round(t.save * 100)}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
