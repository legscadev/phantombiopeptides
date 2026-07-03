"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Props {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

export function DoseSelector({ options, value, onChange, label = "Dose" }: Props) {
  if (options.length <= 1) return null;
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="text-xs font-medium text-foreground">{value}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-sm font-medium transition-all",
              opt === value
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-background-elevated text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
