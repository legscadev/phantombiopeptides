import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.href && !last ? (
              <Link
                href={c.href}
                className="hover:text-foreground transition-colors"
              >
                {c.label}
              </Link>
            ) : (
              <span className={last ? "text-foreground" : ""}>{c.label}</span>
            )}
            {!last && <ChevronRight className="h-3 w-3 opacity-60" />}
          </span>
        );
      })}
    </nav>
  );
}
