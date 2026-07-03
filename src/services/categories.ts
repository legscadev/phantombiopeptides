import "server-only";
import { z } from "zod";
import { wc, shouldUseMocks } from "./woocommerce";
import { wcCategorySchema } from "@/schemas/woocommerce";
import { mockCategories } from "@/mocks/categories";
import type { WCCategory } from "@/types";

const arraySchema = z.array(wcCategorySchema);

export const CategoriesService = {
  async list(): Promise<WCCategory[]> {
    if (shouldUseMocks()) return mockCategories;
    const data = await wc<WCCategory[]>("/products/categories", {
      query: { per_page: 100, hide_empty: false },
      revalidate: 600,
      tags: ["categories:all"],
    });
    // Drop Woo's default "Uncategorized" bucket — it exists on every
    // store but isn't something a customer should ever click.
    return arraySchema
      .parse(data)
      .filter((c) => c.slug !== "uncategorized");
  },

  async getBySlug(slug: string): Promise<WCCategory | null> {
    if (shouldUseMocks()) {
      return mockCategories.find((c) => c.slug === slug) ?? null;
    }
    const data = await wc<WCCategory[]>("/products/categories", {
      query: { slug },
      revalidate: 600,
      tags: [`categories:slug:${slug}`],
    });
    return arraySchema.parse(data)[0] ?? null;
  },

  async getAllSlugs(): Promise<string[]> {
    const list = await this.list();
    return list.map((c) => c.slug);
  },
};
