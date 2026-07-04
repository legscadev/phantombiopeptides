import Link from "next/link";
import { Logo } from "./logo";
import type { WCCategory } from "@/types";

interface FooterProps {
  categories?: WCCategory[];
}

const staticColumns = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/quality", label: "Quality & testing" },
      { href: "/contact", label: "Contact" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/shipping", label: "Shipping & returns" },
      { href: "/research-use", label: "Research use policy" },
    ],
  },
];

const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? "Phantom Bio Peptides";

export function Footer({ categories = [] }: FooterProps) {
  const shopColumn = {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      ...categories.slice(0, 5).map((c) => ({
        href: `/category/${c.slug}`,
        label: c.name,
      })),
    ],
  };
  const columns = [shopColumn, ...staticColumns];

  return (
    <footer className="bg-ambient-dark relative mt-24 overflow-hidden text-white">
      {/* Ambient blobs + grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="animate-blob absolute -left-24 top-0 h-[420px] w-[420px] rounded-full opacity-60 blur-[130px]"
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
            animationDelay: "-8s",
          }}
        />
        <div className="bg-grid-dark absolute inset-0 opacity-50" />
      </div>

      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:hsl(var(--brand-400))]/60 to-transparent" />

      <div className="container-page relative py-20">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="glass-dark ring-glass-dark space-y-5 rounded-3xl p-8">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              Premium research peptides delivered with third-party testing and
              reliable fulfillment. For laboratory research use only.
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-300))]">
              99% HPLC verified · ISL Labs certified
            </p>
          </div>
          {columns.map((col) => (
            <div
              key={col.title}
              className="glass-dark ring-glass-dark rounded-3xl p-8"
            >
              <h4 className="text-brand-gradient font-display text-sm font-extrabold uppercase tracking-[0.22em]">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-300))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FDA disclosure block */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-[11px] leading-relaxed text-white/55">
          <span className="font-semibold text-white/80">FDA Disclosure:</span>{" "}
          The statements on this website have not been evaluated by the U.S.
          Food and Drug Administration. The products and information provided
          by {SITE_NAME} are not intended to diagnose, treat, cure, or prevent
          any disease. These compounds are strictly for laboratory research
          and in-vitro use — not for human consumption, therapeutic use, or
          diagnostic applications.
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-8 text-[11px] uppercase tracking-[0.22em] text-white/50">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
