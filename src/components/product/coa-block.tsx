import { FileText, ShieldCheck, ExternalLink } from "lucide-react";
import { CoasService } from "@/services/coas";

export function CoaBlock({ productSlug }: { productSlug: string }) {
  const matches = CoasService.byProductSlug(productSlug);
  if (matches.length === 0) return null;
  const latest = matches[matches.length - 1];

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Current batch
          </p>
          <div className="mt-1 flex items-baseline gap-2 font-mono text-sm text-foreground">
            #{latest.batch}
            <span className="text-xs text-muted-foreground">
              {latest.entry.dose}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Purity{" "}
            <span className="font-medium text-primary">
              {latest.entry.purity.toFixed(1)}%
            </span>{" "}
            · Independently verified
          </p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={latest.entry.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <FileText className="h-3 w-3" />
              Download COA PDF
            </a>
            <a
              href="/coa"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              All batches <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
