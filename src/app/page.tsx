import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ProductsService } from "@/services/products";
import { CategoriesService } from "@/services/categories";
import { Hero } from "@/components/marketing/hero";
import { Benefits } from "@/components/marketing/benefits";
import { Guarantee } from "@/components/marketing/guarantee";
import { Comparison } from "@/components/marketing/comparison";
import { Commitment } from "@/components/marketing/commitment";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { CategoryShowcase } from "@/components/marketing/category-showcase";
import { CtaSection } from "@/components/marketing/cta-section";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/lib/faqs";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Research-grade peptides, zero compromise",
  description:
    "99%+ purity research peptides, independently HPLC tested. Same-day dispatch, discreet shipping.",
});

export const revalidate = 300;

export default async function HomePage() {
  const emptyList = {
    data: [],
    totalItems: 0,
    totalPages: 1,
    page: 1,
    perPage: 0,
  };
  const [featured, popularResult, categories] = await Promise.all([
    ProductsService.getFeatured(8).catch(() => []),
    ProductsService.list({
      orderby: "popularity",
      order: "desc",
      per_page: 8,
    }).catch(() => emptyList),
    CategoriesService.list().catch(() => []),
  ]);
  const popular = popularResult.data;
  const bestsellers = featured.length > 0 ? featured : popular;

  return (
    <>
      {/* 1 — HERO (dark) */}
      <Hero />

      {/* 2 — BEST SELLERS (light) — light surface breaks the dark hero
             so we never run two dark sections in a row. */}
      <Section
        eyebrow="Top research compounds"
        title="Bestselling now."
        description="Our most-ordered peptides — verified batch-by-batch, in stock and ready to ship."
        actions={
          <Button variant="outline" asChild>
            <Link href="/shop">
              View all products <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      >
        <Reveal>
          <ProductGrid products={bestsellers.slice(0, 8)} priorityCount={4} />
        </Reveal>
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[color:hsl(var(--brand-500))] transition-transform duration-300 hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2"
          >
            Browse the catalog <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Section>

      {/* 3 — GUARANTEE (light) */}
      <Guarantee />

      {/* 4 — SHOP BY CATEGORY (dark) — horizontal rail */}
      <CategoryShowcase categories={categories} />

      {/* 5 — THE PHANTOM STANDARD (light) — breaks the Category dark
             surface so nothing runs dark-dark. */}
      <Benefits />

      {/* 6 — WHY RESEARCHERS CHOOSE PHANTOM BIO (light comparison) */}
      <Comparison />

      {/* 7 — OUR COMMITMENT (light) */}
      <Commitment />

      {/* 8 — HOW IT WORKS (light) */}
      <HowItWorks />

      {/* 9 — FAQ preview (light) */}
      <Reveal>
        <Section eyebrow="FAQ" title="Answers, before you ask.">
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={FAQS.slice(0, 5)} />
            <div className="mt-6 text-center">
              <Button variant="ghost" asChild>
                <Link href="/faq">
                  See all questions <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </Reveal>

      {/* 11 — CLOSING CTA (dark ambient banner) */}
      <CtaSection />
    </>
  );
}
