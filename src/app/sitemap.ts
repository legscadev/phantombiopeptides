import type { MetadataRoute } from "next";
import { ProductsService } from "@/services/products";
import { CategoriesService } from "@/services/categories";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categorySlugs] = await Promise.all([
    ProductsService.getAllSlugs().catch(() => [] as string[]),
    CategoriesService.getAllSlugs().catch(() => [] as string[]),
  ]);
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    "/",
    "/shop",
    "/about",
    "/faq",
    "/contact",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  const products: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: absoluteUrl(`/product/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categories: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: absoluteUrl(`/category/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...products, ...categories];
}
