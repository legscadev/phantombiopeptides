"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ArrowUpRight,
  X,
  Download,
  ExternalLink,
} from "lucide-react";

interface COAViewerProps {
  url: string;
  productName: string;
}

export function COAViewer({ url, productName }: COAViewerProps) {
  const [open, setOpen] = React.useState(false);

  // Build a nice filename and route the download through our own
  // origin so the browser actually saves the file. Cross-origin
  // <a download> is silently ignored — the proxy route sets
  // Content-Disposition: attachment which browsers always honour.
  const downloadFilename = `${productName
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "")}-COA.pdf`;
  const downloadHref = `/api/coa/download?url=${encodeURIComponent(
    url,
  )}&name=${encodeURIComponent(downloadFilename)}`;

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ring-glass group relative mt-6 flex w-full items-center gap-4 overflow-hidden rounded-2xl p-5 text-left transition-transform duration-500 hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--brand-50)) 0%, rgba(255,255,255,0.7) 100%)",
        }}
        aria-label={`View Certificate of Analysis for ${productName}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-[70px]"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--brand-400)) 0%, transparent 70%)",
          }}
        />
        <div
          className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
            boxShadow: "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
          }}
        >
          <FileText className="h-5 w-5" strokeWidth={2.2} />
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[color:hsl(var(--brand-500))]">
            Certificate of Analysis
          </p>
          <p className="mt-1 font-display text-base font-bold tracking-tight text-foreground">
            View the batch COA for {productName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Signed HPLC + mass-spec report from our third-party lab.
          </p>
        </div>
        <ArrowUpRight className="relative h-4 w-4 shrink-0 text-[color:hsl(var(--brand-500))] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={`Certificate of Analysis for ${productName}`}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:px-6 md:py-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[color:hsl(var(--brand-500))]">
                    Certificate of Analysis
                  </p>
                  <p className="mt-0.5 truncate font-display text-base font-bold tracking-tight text-foreground">
                    {productName}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={downloadHref}
                    download={downloadFilename}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_-10px_hsl(var(--brand-500)/0.55)] transition-transform hover:-translate-y-0.5"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))]"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* PDF iframe */}
              <iframe
                src={url}
                title={`Certificate of Analysis for ${productName}`}
                className="min-h-0 flex-1 w-full border-0 bg-white"
                loading="eager"
              />

              {/* Fallback line — some mobile browsers can't render PDFs
                  inline. The link below always works. */}
              <div className="border-t border-border bg-card px-4 py-2.5 text-center text-[11px] text-muted-foreground md:px-6">
                Can&apos;t see the PDF?{" "}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-[color:hsl(var(--brand-500))] hover:underline"
                >
                  Open in a new tab
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
