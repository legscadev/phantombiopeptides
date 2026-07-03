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
    <footer className="relative mt-24 border-t border-border/60 bg-background/50">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="space-y-6">
            <Logo />
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              Premium research peptides delivered with third-party testing and
              reliable fulfillment. For laboratory research use only.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="max-w-xl md:text-right">
            All products offered are strictly for laboratory research and
            in-vitro use. Not for human consumption, therapeutic use, or
            diagnostic applications.
          </p>
        </div>
      </div>
    </footer>
  );
}
