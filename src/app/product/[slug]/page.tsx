import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { ProductsService } from "@/services/products";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductTabs } from "@/components/product/product-tabs";
import {
  RecentlyViewed,
  RecordRecent,
} from "@/components/product/recently-viewed";
import { StickyAddToCart } from "@/components/product/sticky-atc";
import { ProductGrid } from "@/components/product/product-grid";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Badge } from "@/components/ui/badge";
import {
  buildMetadata,
  productJsonLd,
  breadcrumbJsonLd,
} from "@/lib/seo";
import {
  calculateDiscount,
  getProductMeta,
  stripHtml,
  truncate,
} from "@/lib/utils";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Intentionally empty: prerendering every product at build fans out
  // ~5 Woo REST calls per slug across 7 build workers, which trips
  // WordPress.com's 429 rate limit. Pages render on-demand on first
  // visit and are cached by ISR (see `revalidate` above), so we get
  // static behaviour without hammering Woo during the build.
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await ProductsService.getBySlug(slug);
  if (!product) return buildMetadata({ title: "Product not found" });
  return buildMetadata({
    title: product.name,
    description: truncate(
      stripHtml(product.short_description || product.description),
      200,
    ),
    path: `/product/${product.slug}`,
    images: product.images.map((i) => i.src),
  });
}

const TRUST_BADGES = [
  { icon: Truck, label: "Ships next day", sub: "Cold-chain" },
  { icon: ShieldCheck, label: "≥99% HPLC", sub: "Purity verified" },
  { icon: Package, label: "Lot COA", sub: "Included" },
  { icon: RotateCcw, label: "Defect free", sub: "Or replaced" },
];

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await ProductsService.getBySlug(slug);
  if (!product) notFound();

  const [related, reviews, variations] = await Promise.all([
    ProductsService.getRelated(product.id, 4),
    ProductsService.getReviews(product.id),
    product.type === "variable"
      ? ProductsService.getVariations(product.id).catch(() => [])
      : Promise.resolve([]),
  ]);

  const primaryCategory = product.categories[0];
  const discount = product.on_sale
    ? calculateDiscount(
        product.regular_price,
        product.sale_price || product.price,
      )
    : 0;
  const coaUrl = getProductMeta(product.meta_data, "coa_url");

  return (
    <>
      <Script
        id="ld-product"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)),
        }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Shop", url: "/shop" },
              ...(primaryCategory
                ? [
                    {
                      name: primaryCategory.name,
                      url: `/category/${primaryCategory.slug}`,
                    },
                  ]
                : []),
              { name: product.name, url: `/product/${product.slug}` },
            ]),
          ),
        }}
      />

      <RecordRecent
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          images: product.images,
        }}
      />

      <div className="container-page py-8 md:py-12">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            ...(primaryCategory
              ? [
                  {
                    label: primaryCategory.name,
                    href: `/category/${primaryCategory.slug}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:pt-4">
            <div className="flex flex-wrap items-center gap-2">
              {primaryCategory && (
                <Link
                  href={`/category/${primaryCategory.slug}`}
                  className="text-xs uppercase tracking-[0.16em] text-primary hover:underline"
                >
                  {primaryCategory.name}
                </Link>
              )}
              {discount > 0 && <Badge variant="sale">Save {discount}%</Badge>}
              {product.tags.some((t) => t.slug === "new") && (
                <Badge variant="accent">New</Badge>
              )}
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            {product.rating_count > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(parseFloat(product.average_rating))
                          ? "h-3.5 w-3.5 fill-warning text-warning"
                          : "h-3.5 w-3.5 text-border"
                      }
                    />
                  ))}
                </div>
                <span>
                  {product.average_rating} · {product.rating_count} reviews
                </span>
              </div>
            )}

            <p className="mt-6 max-w-xl text-base text-muted-foreground leading-relaxed">
              {product.short_description}
            </p>

            <div className="mt-8">
              <PurchasePanel product={product} variations={variations} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TRUST_BADGES.map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl border border-border bg-card/60 p-3 text-xs"
                >
                  <b.icon className="mb-2 h-4 w-4 text-primary" />
                  <div className="font-medium text-foreground">{b.label}</div>
                  <div className="text-muted-foreground">{b.sub}</div>
                </div>
              ))}
            </div>

            {coaUrl && (
              <a
                href={coaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ring-glass group relative mt-6 flex items-center gap-4 overflow-hidden rounded-2xl p-5 transition-transform duration-500 hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--brand-50)) 0%, rgba(255,255,255,0.7) 100%)",
                }}
                aria-label={`Download Certificate of Analysis for ${product.name} (opens PDF in a new tab)`}
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
                    boxShadow:
                      "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                  }}
                >
                  <FileText className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div className="relative min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[color:hsl(var(--brand-500))]">
                    Certificate of Analysis
                  </p>
                  <p className="mt-1 font-display text-base font-bold tracking-tight text-foreground">
                    Download the batch COA for {product.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Signed HPLC + mass-spec report from our third-party lab.
                  </p>
                </div>
                <ArrowUpRight className="relative h-4 w-4 shrink-0 text-[color:hsl(var(--brand-500))] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}

            {product.attributes.length > 0 && (
              <div className="mt-8 rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                  Specifications
                </p>
                <dl className="space-y-2 text-sm">
                  {product.attributes.map((a) => (
                    <div key={a.name} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{a.name}</dt>
                      <dd className="text-right text-foreground">
                        {a.options.join(", ")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
        </Reveal>

        <Reveal>
          <div className="mt-16">
            <ProductTabs product={product} reviews={reviews} />
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <Reveal>
          <Section eyebrow="Related" title="You may also like">
            <ProductGrid products={related} />
          </Section>
        </Reveal>
      )}

      <Reveal>
        <RecentlyViewed excludeId={product.id} />
      </Reveal>

      <StickyAddToCart product={product} />
    </>
  );
}
