import "server-only";
import { ProductsService } from "./products";
import type { WCProduct } from "@/types";

export interface SearchResult {
  products: WCProduct[];
  totalItems: number;
}

export const SearchService = {
  async query(q: string, limit = 8): Promise<SearchResult> {
    if (!q.trim()) return { products: [], totalItems: 0 };
    const { data, totalItems } = await ProductsService.list({
      search: q,
      per_page: limit,
    });
    return { products: data, totalItems };
  },

  async suggestions(q: string, limit = 5): Promise<Array<{ id: number; name: string; slug: string; image?: string }>> {
    const { products } = await this.query(q, limit);
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.src,
    }));
  },
};
