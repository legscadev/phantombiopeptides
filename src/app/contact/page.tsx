import Link from "next/link";
import {
  MessageCircle,
  Clock,
  Building,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { CtaSection } from "@/components/marketing/cta-section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the Phantom Bio Peptides research team.",
  path: "/contact",
});

const WHATSAPP_NUMBER = "+15593606568";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+1 559 360 6568",
    hint: "Fastest response — message us anytime on WhatsApp.",
    href: WHATSAPP_URL,
  },
  {
    icon: Clock,
    label: "Support hours",
    value: "Mon – Fri · 9am – 6pm ET",
    hint: "Live coverage. After-hours messages queue for morning.",
  },
  {
    icon: Building,
    label: "Institutional",
    value: "Bulk & institutional orders",
    hint: "Include your affiliation and volume needs for tiered pricing.",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* 1 — HERO (dark ambient) */}
      <section className="bg-ambient-dark relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="animate-blob absolute -left-24 top-10 h-[440px] w-[440px] rounded-full opacity-60 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, #4900AD 0%, transparent 65%)",
            }}
          />
          <div
            className="animate-blob absolute right-[-6rem] top-20 h-[360px] w-[360px] rounded-full opacity-40 blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, #7433FF 0%, transparent 70%)",
              animationDelay: "-7s",
            }}
          />
          <div className="bg-grid-dark absolute inset-0 opacity-55" />
        </div>

        <div className="container-page relative z-10 py-20 md:py-28">
          <Reveal>
            <div className="glass-dark mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/80">
              <Sparkles className="h-3 w-3 text-[color:hsl(var(--brand-300))]" />
              We respond within one business day
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-6xl lg:text-7xl">
              Get in{" "}
              <span className="text-brand-gradient">touch.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty">
              Questions about a compound, a specific lot, or an order? Our
              research team is here.{" "}
              <Link
                href="/faq"
                className="underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
              >
                Have you checked the FAQ?
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 — CHANNELS + FORM (light) */}
      <section className="relative py-16 md:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                    How to reach us
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Direct lines to the team.
                  </h2>
                </div>
                <ul className="space-y-4">
                  {CHANNELS.map((c) => (
                    <li
                      key={c.label}
                      className="glass ring-glass group flex items-start gap-4 rounded-2xl p-5 transition-transform duration-500 hover:-translate-y-0.5"
                    >
                      <div
                        className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                          boxShadow:
                            "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                        }}
                      >
                        <c.icon className="h-5 w-5" strokeWidth={2.2} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                          {c.label}
                        </div>
                        {c.href ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 block font-display text-base font-bold tracking-tight text-foreground transition-colors hover:text-[color:hsl(var(--brand-500))]"
                          >
                            {c.value}
                          </a>
                        ) : (
                          <div className="mt-1 font-display text-base font-bold tracking-tight text-foreground">
                            {c.value}
                          </div>
                        )}
                        {c.hint && (
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {c.hint}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* FAQ nudge — brand-tinted glass card */}
                <div
                  className="ring-glass relative overflow-hidden rounded-3xl p-6"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--brand-50)) 0%, rgba(255,255,255,0.7) 100%)",
                  }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-45 blur-[100px]"
                    style={{
                      background:
                        "radial-gradient(circle, hsl(var(--brand-400)) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                      Quick answers
                    </p>
                    <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight">
                      Skip the wait.
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      Most questions about purity, shipping, and returns are
                      answered in the FAQ.
                    </p>
                    <Link
                      href="/faq"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:hsl(var(--brand-500))] transition-transform duration-300 hover:translate-x-0.5"
                    >
                      Browse the FAQ <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — closing CTA (dark) */}
      <CtaSection />
    </>
  );
}
