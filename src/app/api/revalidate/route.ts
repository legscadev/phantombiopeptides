import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { env } from "@/env";

/**
 * On-demand revalidation endpoint. Wire this up as a WooCommerce webhook:
 *   URL: https://<site>/api/revalidate?secret=<REVALIDATE_SECRET>
 *   Topics: product.created / product.updated / product.deleted
 *
 * Payload should include { tag?: string, path?: string }.
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");
  if (!env.REVALIDATE_SECRET || secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    tag?: string;
    path?: string;
    slug?: string;
    categorySlug?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    /* accept empty body */
  }

  const tags = new Set<string>(["products:list", "categories:all"]);
  const paths = new Set<string>(["/", "/shop"]);

  if (body.tag) tags.add(body.tag);
  if (body.path) paths.add(body.path);
  if (body.slug) {
    tags.add(`products:slug:${body.slug}`);
    paths.add(`/product/${body.slug}`);
  }
  if (body.categorySlug) {
    tags.add(`categories:slug:${body.categorySlug}`);
    paths.add(`/category/${body.categorySlug}`);
  }

  tags.forEach((t) => revalidateTag(t, "default"));
  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ revalidated: true, tags: [...tags], paths: [...paths] });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
