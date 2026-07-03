import Image from "next/image";
import Link from "next/link";
import { FileText, ExternalLink, ShieldCheck, Search } from "lucide-react";
import { CoasService } from "@/services/coas";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Reveal } from "@/components/common/reveal";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "COA library — Certificates of Analysis",
  description:
    "Independent HPLC certificates of analysis for every batch we ship. Verify purity, batch number, and testing lab before you order.",
  path: "/coa",
});

export const revalidate = 3600;

export default function CoaLibraryPage() {
  const batches = CoasService.list();
  const total = CoasService.totalCount();

  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <>
      <Breadcrumb
        crumbs={[{ label: "Home", href: "/" }, { label: "COA Library" }]}
      />

      <div className="mt-6 flex flex-col gap-3 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Certificates of analysis
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            Independent proof of purity.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every batch tested via HPLC by an independent lab before it ships.
            Purity data is published here <em>before</em> the batch is
            released for sale — not after.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div>
            <div className="font-mono text-lg font-semibold text-foreground">
              {total}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Published COAs
            </div>
          </div>
        </div>
      </div>
        </>
      </Reveal>

      <Reveal delay={0.08}>
      {batches.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-16 text-center">
          <p className="text-lg font-medium">No COAs published yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Check back shortly — batch releases are indexed here as they
            arrive from the lab.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {batches.map((batch) => (
            <section key={batch.batch}>
              <header className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-border pb-4">
                <div>
                  <h2 className="font-mono text-lg text-foreground">
                    Batch <span className="text-primary">#{batch.batch}</span>
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Released{" "}
                    {new Date(batch.issued_at).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · Tested by {batch.lab}
                  </p>
                </div>
                {batch.verification_url && (
                  <a
                    href={batch.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Verify at {batch.lab}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </header>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {batch.coas.map((c) => (
                  <li key={c.id}>
                    <a
                      href={c.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-3 transition-all hover:border-border-strong hover:bg-background-elevated"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                        {c.thumb_url ? (
                          <Image
                            src={c.thumb_url}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <FileText className="absolute inset-0 m-auto h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {c.product_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {c.dose} · Batch #{batch.batch}
                            </p>
                          </div>
                          <Badge variant="accent">{c.purity.toFixed(1)}%</Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-[11px] text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          <FileText className="h-3 w-3" /> Open PDF
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
      </Reveal>

      <Reveal delay={0.16}>
      <div className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8 text-center">
        <Search className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          Looking for a specific COA?
        </h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Every product page links directly to the current batch&apos;s COA.
          For older batches, contact our team.
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/shop"
            className="text-sm text-primary hover:underline"
          >
            Browse the catalog →
          </Link>
          <Link
            href="/contact"
            className="text-sm text-primary hover:underline"
          >
            Contact support →
          </Link>
        </div>
      </div>
      </Reveal>
    </div>
  );
}
