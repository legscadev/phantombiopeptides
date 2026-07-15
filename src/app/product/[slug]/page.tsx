import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Package,
} from "lucide-react";
import { ProductsService } from "@/services/products";
import { resolveWpMediaUrl } from "@/services/woocommerce";
import { COAViewer } from "@/components/product/coa-viewer";
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
  getProductMetaAttachmentId,
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
  // Prefer a direct URL from meta (ACF File URL or URL field). Fall
  // back to resolving a raw WordPress attachment id, which is what
  // Woo REST returns for ACF File fields regardless of Return Format.
  let coaUrl = getProductMeta(product.meta_data, "coa_url");
  if (!coaUrl) {
    const coaAttachmentId = getProductMetaAttachmentId(
      product.meta_data,
      "coa_url",
    );
    if (coaAttachmentId) {
      coaUrl = (await resolveWpMediaUrl(coaAttachmentId)) ?? undefined;
    }
  }

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
              <COAViewer url={coaUrl} productName={product.name} />
            )}

            <div className="mt-8 rounded-xl border border-border bg-card p-5">
              <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
                Specifications
              </p>
              <dl className="space-y-2 text-sm">
                {(product.sku || product.id) && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">SKU</dt>
                    <dd className="text-right text-foreground">
                      {product.sku || String(product.id)}
                    </dd>
                  </div>
                )}
                {product.attributes.map((a) => (
                  <div key={a.name} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{a.name}</dt>
                    <dd className="text-right text-foreground">
                      {a.options.join(", ")}
                    </dd>
                  </div>
                ))}
                {product.categories.length > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="text-right text-foreground">
                      {product.categories.map((c) => c.name).join(", ")}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Stock status</dt>
                  <dd
                    className={
                      product.stock_status === "instock"
                        ? "text-right text-success"
                        : product.stock_status === "onbackorder"
                          ? "text-right text-warning"
                          : "text-right text-destructive"
                    }
                  >
                    {product.stock_status === "instock"
                      ? "In stock"
                      : product.stock_status === "onbackorder"
                        ? "Backorder"
                        : "Out of stock"}
                  </dd>
                </div>
              </dl>
            </div>
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
