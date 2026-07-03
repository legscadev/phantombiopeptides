import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5",
        className,
      )}
      aria-label="Phantom Labs — home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary to-accent shadow-lg shadow-primary/30 transition-transform duration-500 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-primary-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 3l7 4v10l-7 4-7-4V7l7-4z" />
          <path d="M12 8l3 1.7v4.6L12 16l-3-1.7V9.7L12 8z" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          Phantom<span className="text-primary">Bio</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Research Peptides
        </span>
      </span>
    </Link>
  );
}
