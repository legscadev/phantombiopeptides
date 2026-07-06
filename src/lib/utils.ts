import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number | string,
  currency = "USD",
  locale = "en-US",
) {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function calculateDiscount(
  regular: string | number,
  sale: string | number,
): number {
  const r = typeof regular === "string" ? parseFloat(regular) : regular;
  const s = typeof sale === "string" ? parseFloat(sale) : sale;
  if (!r || !s || r <= s) return 0;
  return Math.round(((r - s) / r) * 100);
}

export function absoluteUrl(path = ""): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Read a WooCommerce product's custom-field value. Woo returns meta
 * as `[{ key, value }]`; we accept either a public key (`coa_url`)
 * or the underscored private form (`_coa_url`) so wp-admin editors
 * can use whichever they're comfortable with. Case-insensitive match.
 */
export function getProductMeta(
  meta: Array<{ key: string; value: unknown }> | undefined,
  key: string,
): string | undefined {
  if (!meta || meta.length === 0) return undefined;
  const wanted = key.toLowerCase().replace(/^_/, "");
  const isUrl = (s: string) => /^https?:\/\//i.test(s.trim());
  for (const entry of meta) {
    const k = entry.key.toLowerCase().replace(/^_/, "");
    if (k !== wanted) continue;
    const v = entry.value;
    // 1. Plain string — ACF Return Format: "File URL" or a URL field.
    if (typeof v === "string" && isUrl(v)) return v.trim();
    // 2. ACF "File Array" return format: { id, url, filename, ... }.
    if (v && typeof v === "object") {
      const url = (v as { url?: unknown }).url;
      if (typeof url === "string" && isUrl(url)) return url.trim();
    }
    // 3. Raw attachment IDs (numbers or numeric strings) are handled
    // by getProductMetaAttachmentId + resolveWpMediaUrl. WooCommerce's
    // REST API returns the raw stored value for ACF File fields;
    // ACF's "Return Format: File URL" transformation only applies
    // when reading via PHP's get_field(), not REST.
  }
  return undefined;
}

/**
 * When the meta value is a raw WordPress attachment id (as returned
 * by ACF File fields via the REST API), return it as a number so the
 * caller can resolve it via `/wp-json/wp/v2/media/{id}`.
 */
export function getProductMetaAttachmentId(
  meta: Array<{ key: string; value: unknown }> | undefined,
  key: string,
): number | undefined {
  if (!meta || meta.length === 0) return undefined;
  const wanted = key.toLowerCase().replace(/^_/, "");
  for (const entry of meta) {
    const k = entry.key.toLowerCase().replace(/^_/, "");
    if (k !== wanted) continue;
    const v = entry.value;
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
    if (typeof v === "string" && /^\d+$/.test(v.trim())) {
      const n = parseInt(v.trim(), 10);
      if (Number.isFinite(n) && n > 0) return n;
    }
    // ACF File Array shape: { id, url, ... }. If the caller already
    // grabbed .url via getProductMeta, we return undefined here so
    // we don't double-resolve.
    if (v && typeof v === "object") {
      const id = (v as { id?: unknown }).id;
      if (typeof id === "number" && Number.isFinite(id) && id > 0) {
        const url = (v as { url?: unknown }).url;
        if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
          return id;
        }
      }
    }
  }
  return undefined;
}
