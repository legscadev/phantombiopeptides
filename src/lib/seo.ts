import type { Metadata } from "next";
import { absoluteUrl, stripHtml, truncate } from "./utils";
import type { WCProduct } from "@/types";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Phantom Bio Peptides";
const SITE_DESCRIPTION =
  "Premium research peptides with third-party testing and reliable fulfillment. For laboratory research use only.";
const OG_IMAGE = "/og-default.png";

export function buildMetadata({
  title,
  description,
  path = "",
  images,
  noIndex,
}: {
  title?: string;
  description?: string;
  path?: string;
  images?: string[];
  noIndex?: boolean;
}): Metadata {
  const finalTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const finalDescription = description ?? SITE_DESCRIPTION;
  const url = absoluteUrl(path);
  const ogImages = (images && images.length > 0 ? images : [OG_IMAGE]).map(
    (src) => ({ url: src.startsWith("http") ? src : absoluteUrl(src) }),
  );

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: url },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: ogImages.map((i) => i.url),
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function productJsonLd(product: WCProduct) {
  const description = truncate(
    stripHtml(product.short_description || product.description),
    500,
  );
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description,
    sku: product.sku || String(product.id),
    image: product.images.map((i) => i.src),
    brand: { "@type": "Brand", name: SITE_NAME },
    aggregateRating:
      product.rating_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.rating_count,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock_status === "instock"
          ? "https://schema.org/InStock"
          : product.stock_status === "onbackorder"
            ? "https://schema.org/BackOrder"
            : "https://schema.org/OutOfStock",
    },
  };
}

export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url.startsWith("http") ? c.url : absoluteUrl(c.url),
    })),
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl(),
    logo: absoluteUrl("/logo.png"),
    sameAs: [],
  };
}
