import type { ProductQueryParams } from "@/types";

/**
 * Parse Next.js `searchParams` (async in Next 15/16 — an object of
 * strings|arrays) into a typed WooCommerce product query.
 */
export function parseProductSearchParams(
  sp: Record<string, string | string[] | undefined>,
): ProductQueryParams & { sort: string } {
  const one = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const page = Math.max(1, parseInt(one("page") ?? "1", 10) || 1);
  const perPage = Math.min(48, parseInt(one("per_page") ?? "12", 10) || 12);
  const sort = one("sort") ?? "date-desc";
  const [orderby, order] = sort.split("-") as [
    ProductQueryParams["orderby"],
    ProductQueryParams["order"],
  ];

  const minPrice = one("min_price");
  const maxPrice = one("max_price");

  return {
    page,
    per_page: perPage,
    search: one("q") || undefined,
    category: one("category") || undefined,
    on_sale: one("on_sale") === "true" ? true : undefined,
    stock_status:
      (one("stock_status") as ProductQueryParams["stock_status"]) || undefined,
    min_price: minPrice ? Number(minPrice) : undefined,
    max_price: maxPrice ? Number(maxPrice) : undefined,
    orderby,
    order,
    sort,
  };
}
