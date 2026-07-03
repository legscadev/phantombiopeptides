"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: Props) {
  const pathname = usePathname();
  const params = useSearchParams();
  if (totalPages <= 1) return null;

  function build(p: number) {
    const sp = new URLSearchParams(params.toString());
    if (p === 1) sp.delete("page");
    else sp.set("page", String(p));
    return `${pathname}?${sp.toString()}`;
  }

  const numbers: (number | "...")[] = [];
  const push = (n: number | "...") => {
    if (numbers[numbers.length - 1] !== n) numbers.push(n);
  };
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= page - 1 && i <= page + 1)
    ) {
      push(i);
    } else if (i < page - 1 || i > page + 1) {
      push("...");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <PageLink href={build(Math.max(1, page - 1))} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </PageLink>
      {numbers.map((n, i) =>
        n === "..." ? (
          <span
            key={`d-${i}`}
            className="px-2 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <PageLink key={n} href={build(n)} active={n === page}>
            {n}
          </PageLink>
        ),
      )}
      <PageLink
        href={build(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const classes = cn(
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full border border-border bg-background-elevated px-3 text-sm transition-colors",
    "hover:border-primary/50 hover:text-foreground",
    active && "border-primary bg-primary text-primary-foreground",
    disabled && "pointer-events-none opacity-30",
  );
  if (disabled) return <span className={classes}>{children}</span>;
  return (
    <Link href={href} className={classes} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
