import "server-only";
import { z } from "zod";
import { env } from "@/env";

/**
 * WordPress posts REST endpoint (built-in, no plugin needed).
 * Runs server-side and cache-tagged for on-demand revalidation.
 */

const postSchema = z.object({
  id: z.number(),
  date: z.string(),
  slug: z.string(),
  status: z.string(),
  title: z.object({ rendered: z.string() }),
  excerpt: z.object({ rendered: z.string() }),
  content: z.object({ rendered: z.string() }),
  featured_media: z.number().optional(),
  categories: z.array(z.number()).optional().default([]),
  _embedded: z
    .object({
      "wp:featuredmedia": z
        .array(
          z.object({
            source_url: z.string().optional(),
            alt_text: z.string().optional(),
          }),
        )
        .optional(),
      author: z
        .array(z.object({ name: z.string().optional() }))
        .optional(),
    })
    .optional(),
});

export type WPPost = z.infer<typeof postSchema>;

const CACHE_TAG = "wp:posts";
const REVALIDATE = 600;

async function wp<T>(path: string, opts?: { revalidate?: number }): Promise<T> {
  if (!env.WC_STORE_URL) {
    throw new Error("WC_STORE_URL not configured — needed for WP posts.");
  }
  const url = `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-json/wp/v2${path}`;
  const res = await fetch(url, {
    next: { revalidate: opts?.revalidate ?? REVALIDATE, tags: [CACHE_TAG] },
  });
  if (!res.ok) throw new Error(`WP fetch failed ${res.status}`);
  return (await res.json()) as T;
}

export const PostsService = {
  async list(page = 1, perPage = 12): Promise<WPPost[]> {
    try {
      const data = await wp<unknown[]>(
        `/posts?per_page=${perPage}&page=${page}&_embed=wp:featuredmedia,author&status=publish`,
      );
      return z.array(postSchema).parse(data);
    } catch {
      return [];
    }
  },

  async getBySlug(slug: string): Promise<WPPost | null> {
    try {
      const data = await wp<unknown[]>(
        `/posts?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia,author&status=publish`,
      );
      const parsed = z.array(postSchema).parse(data);
      return parsed[0] ?? null;
    } catch {
      return null;
    }
  },

  async getAllSlugs(): Promise<string[]> {
    const list = await this.list(1, 50);
    return list.map((p) => p.slug);
  },
};
