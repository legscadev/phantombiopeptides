import Script from "next/script";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
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
      <div className="container-page py-10 md:py-14">
        <Breadcrumb
          crumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        />
        <div className="mt-8 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            FAQ
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Search the knowledge base or browse below.
          </p>
        </div>
        <div className="mt-10 max-w-3xl">
          <FAQAccordion items={FAQS} searchable />
        </div>
      </div>
    </>
  );
}
