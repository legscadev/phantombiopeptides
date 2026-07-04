import * as React from "react";
import { cn } from "@/lib/utils";

interface DarkSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  container?: boolean;
  headingAlign?: "left" | "center";
  /** Skip the ambient drifting blobs (still keeps the dark surface). */
  bare?: boolean;
}

/**
 * Dark-surface counterpart to <Section>. Uses the brand-black surface,
 * drifting brand blobs, and a subtle grid overlay. Copy renders on
 * white; overlines use the brand purple tint.
 */
export function DarkSection({
  eyebrow,
  title,
  description,
  actions,
  container = true,
  headingAlign = "left",
  bare = false,
  className,
  children,
  ...props
}: DarkSectionProps) {
  return (
    <section
      className={cn(
        "bg-ambient-dark relative overflow-hidden py-20 text-white md:py-28",
        className,
      )}
      {...props}
    >
      {!bare && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="animate-blob absolute -left-24 top-8 h-[420px] w-[420px] rounded-full opacity-55 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #4900AD 0%, transparent 65%)",
            }}
          />
          <div
            className="animate-blob absolute -right-16 bottom-0 h-[360px] w-[360px] rounded-full opacity-40 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #7433FF 0%, transparent 70%)",
              animationDelay: "-9s",
            }}
          />
          <div className="bg-grid-dark absolute inset-0 opacity-45" />
        </div>
      )}
      <div className={cn("relative", container && "container-page")}>
        {(eyebrow || title || description || actions) && (
          <div
            className={cn(
              "mb-10 flex flex-col gap-3 md:mb-14",
              headingAlign === "center" && "items-center text-center",
              actions && "md:flex-row md:items-end md:justify-between",
            )}
          >
            <div
              className={cn(
                "space-y-3",
                headingAlign === "center" && "text-center",
              )}
            >
              {eyebrow && (
                <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-300))]">
                  <span className="h-px w-6 bg-[color:hsl(var(--brand-300))]/60" />
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl md:text-5xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="max-w-2xl text-base leading-relaxed text-white/65 text-pretty">
                  {description}
                </p>
              )}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
