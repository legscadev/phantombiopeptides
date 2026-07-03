import "server-only";
import { z } from "zod";
import { wc, wcWithMeta, shouldUseMocks } from "./woocommerce";
import { wcProductSchema, wcReviewSchema } from "@/schemas/woocommerce";
import { mockProducts, mockReviewsByProduct } from "@/mocks/products";
import type { ProductQueryParams, WCProduct, WCReview } from "@/types";

const productsArraySchema = z.array(wcProductSchema);
const reviewsArraySchema = z.array(wcReviewSchema);

const CACHE = { revalidate: 300, tag: (p: string) => `products:${p}` };

function mockList(params: ProductQueryParams = {}) {
  let list = [...mockProducts];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    );
  }
  if (params.category) {
    const cat = String(params.category);
    list = list.filter(
      (p) =>
        p.categories.some(
          (c) => c.slug === cat || String(c.id) === cat,
        ),
    );
  }
  if (params.featured) {
    list = list.filter((p) => p.featured);
  }
  if (params.on_sale) {
    list = list.filter((p) => p.on_sale);
  }
  if (params.stock_status) {
    list = list.filter((p) => p.stock_status === params.stock_status);
  }
  if (typeof params.min_price === "number") {
    list = list.filter((p) => parseFloat(p.price) >= params.min_price!);
  }
  if (typeof params.max_price === "number") {
    list = list.filter((p) => parseFloat(p.price) <= params.max_price!);
  }
  if (params.include?.length) {
    list = list.filter((p) => params.include!.includes(p.id));
  }
  if (params.exclude?.length) {
    list = list.filter((p) => !params.exclude!.includes(p.id));
  }

  const orderby = params.orderby ?? "date";
  const dir = params.order === "asc" ? 1 : -1;
  list.sort((a, b) => {
    switch (orderby) {
      case "price":
        return (parseFloat(a.price) - parseFloat(b.price)) * dir;
      case "title":
        return a.name.localeCompare(b.name) * dir;
      case "rating":
        return (parseFloat(a.average_rating) - parseFloat(b.average_rating)) * dir;
      case "popularity":
        return (a.rating_count - b.rating_count) * dir;
      default:
        return (a.id - b.id) * dir;
    }
  });

  const page = params.page ?? 1;
  const perPage = params.per_page ?? 12;
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const paged = list.slice((page - 1) * perPage, page * perPage);
  return { data: paged, totalItems, totalPages, page, perPage };
}

export const ProductsService = {
  async list(params: ProductQueryParams = {}) {
    if (shouldUseMocks()) {
      return mockList(params);
    }
    const query: Record<string, string | number | boolean | undefined> = {
      page: params.page ?? 1,
      per_page: params.per_page ?? 12,
      category: params.category as string | undefined,
      search: params.search,
      min_price: params.min_price,
      max_price: params.max_price,
      stock_status: params.stock_status,
      on_sale: params.on_sale,
      featured: params.featured,
      orderby: params.orderby,
      order: params.order,
      include: params.include?.join(","),
      exclude: params.exclude?.join(","),
    };
    const { data, total, totalPages } = await wcWithMeta<WCProduct[]>(
      "/products",
      {
        query,
        revalidate: CACHE.revalidate,
        tags: [CACHE.tag("list")],
      },
    );
    const parsed = productsArraySchema.parse(data);
    return {
      data: parsed,
      totalItems: total || parsed.length,
      totalPages: totalPages || 1,
      page: params.page ?? 1,
      perPage: params.per_page ?? 12,
    };
  },

  async getBySlug(slug: string): Promise<WCProduct | null> {
    if (shouldUseMocks()) {
      return mockProducts.find((p) => p.slug === slug) ?? null;
    }
    const data = await wc<WCProduct[]>("/products", {
      query: { slug },
      revalidate: CACHE.revalidate,
      tags: [CACHE.tag(`slug:${slug}`)],
    });
    return productsArraySchema.parse(data)[0] ?? null;
  },

  async getById(id: number): Promise<WCProduct | null> {
    if (shouldUseMocks()) {
      return mockProducts.find((p) => p.id === id) ?? null;
    }
    const data = await wc<WCProduct>(`/products/${id}`, {
      revalidate: CACHE.revalidate,
      tags: [CACHE.tag(`id:${id}`)],
    });
    return wcProductSchema.parse(data);
  },

  async getRelated(id: number, limit = 4): Promise<WCProduct[]> {
    const product = await this.getById(id);
    if (!product) return [];
    const ids = product.related_ids?.slice(0, limit) ?? [];
    if (!ids.length) return [];
    if (shouldUseMocks()) {
      return mockProducts.filter((p) => ids.includes(p.id));
    }
    const { data } = await this.list({ include: ids, per_page: limit });
    return data;
  },

  async getFeatured(limit = 6): Promise<WCProduct[]> {
    const { data } = await this.list({ featured: true, per_page: limit });
    return data;
  },

  async getReviews(productId: number): Promise<WCReview[]> {
    if (shouldUseMocks()) {
      return mockReviewsByProduct[productId] ?? [];
    }
    const data = await wc<WCReview[]>("/products/reviews", {
      query: { product: productId },
      revalidate: 60,
    });
    return reviewsArraySchema.parse(data);
  },

  async getAllSlugs(): Promise<string[]> {
    if (shouldUseMocks()) {
      return mockProducts.map((p) => p.slug);
    }
    const { data } = await this.list({ per_page: 100 });
    return data.map((p) => p.slug);
  },
};
