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
  for (const entry of meta) {
    const k = entry.key.toLowerCase().replace(/^_/, "");
    if (k !== wanted) continue;
    const v = entry.value;
    if (typeof v === "string" && v.trim() !== "") return v.trim();
    if (typeof v === "number") return String(v);
  }
  return undefined;
}
