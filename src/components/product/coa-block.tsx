import { FileText, ShieldCheck, ExternalLink } from "lucide-react";
import { CoasService } from "@/services/coas";

export function CoaBlock({ productSlug }: { productSlug: string }) {
  const matches = CoasService.byProductSlug(productSlug);
  if (matches.length === 0) return null;
  const latest = matches[matches.length - 1];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Current batch
          </p>
          <div className="mt-0.5 flex items-baseline gap-2 font-mono text-sm text-foreground">
            #{latest.batch}
            <span className="text-xs text-muted-foreground">
              {latest.entry.dose}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Purity</div>
          <div className="font-display text-xl font-bold text-primary">
            {latest.entry.purity.toFixed(1)}%
          </div>
        </div>
      </div>
      <a
        href={latest.entry.pdf_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-destructive px-5 py-3 text-sm font-semibold text-destructive-foreground shadow-md shadow-destructive/25 transition-all hover:brightness-110"
      >
        <FileText className="h-4 w-4" />
        Download full COA PDF
      </a>
      <a
        href="/coa"
        className="mt-3 inline-flex w-full items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        All batches <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}
