import Script from "next/script";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { FAQBrowser } from "@/components/marketing/faq-browser";
import { FAQS } from "@/lib/faqs";
import { CtaSection } from "@/components/marketing/cta-section";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "FAQ",
  description: "Answers to common questions about our research compounds.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <Script
        id="ld-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(FAQS.map((f) => ({ q: f.q, a: f.a }))),
          ),
        }}
      />

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
            className="animate-blob absolute right-[-6rem] top-24 h-[360px] w-[360px] rounded-full opacity-40 blur-[110px]"
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
              <HelpCircle className="h-3 w-3 text-[color:hsl(var(--brand-300))]" />
              Support · {FAQS.length} questions
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-6xl lg:text-7xl">
              Frequently{" "}
              <span className="text-brand-gradient">asked.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty">
              Search the knowledge base or filter by topic. If you can&apos;t
              find an answer,{" "}
              <Link
                href="/contact"
                className="underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
              >
                our team responds within one business day
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 — BROWSER (light) */}
      <section className="relative py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <FAQBrowser items={FAQS} />
          </Reveal>
        </div>
      </section>

      {/* 3 — closing CTA (dark) */}
      <CtaSection />
    </>
  );
}
