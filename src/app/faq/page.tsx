import Script from "next/script";
import { Reveal } from "@/components/common/reveal";
import { FAQBrowser } from "@/components/marketing/faq-browser";
import { FAQS } from "@/lib/faqs";
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
          __html: JSON.stringify(faqJsonLd(FAQS.map((f) => ({ q: f.q, a: f.a })))),
        }}
      />
      <div className="container-page py-16 md:py-24">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[0.32em] text-primary">
              Support · {FAQS.length} questions
            </p>
            <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Frequently asked.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Search the knowledge base or filter by topic. If you can&apos;t
              find an answer, our support team responds within one business
              day.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-14 border-t border-border pt-10">
            <FAQBrowser items={FAQS} />
          </div>
        </Reveal>
      </div>
    </>
  );
}
