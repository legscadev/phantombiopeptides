import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  container?: boolean;
  headingAlign?: "left" | "center";
}

export function Section({
  eyebrow,
  title,
  description,
  actions,
  container = true,
  headingAlign = "left",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("py-16 md:py-24", className)}
      {...props}
    >
      <div className={container ? "container-page" : ""}>
        {(eyebrow || title || description || actions) && (
          <div
            className={cn(
              "mb-10 flex flex-col gap-3 md:mb-14",
              headingAlign === "center" && "items-center text-center",
              actions && "md:flex-row md:items-end md:justify-between",
            )}
          >
            <div className={cn("space-y-3", headingAlign === "center" && "text-center")}>
              {eyebrow && (
                <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-primary">
                  <span className="h-px w-6 bg-primary/50" />
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
                  {title}
                </h2>
              )}
              {description && (
                <p className="max-w-2xl text-base text-muted-foreground text-pretty leading-relaxed">
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
