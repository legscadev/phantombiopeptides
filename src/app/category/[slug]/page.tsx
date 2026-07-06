import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoriesService } from "@/services/categories";
import { ProductsService } from "@/services/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";
import { ProductSort } from "@/components/product/product-sort";
import { Pagination } from "@/components/product/pagination";
import { Reveal } from "@/components/common/reveal";
import { buildMetadata } from "@/lib/seo";
import { parseProductSearchParams } from "@/lib/parse-search";
import { cn } from "@/lib/utils";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  // Intentionally empty: prerendering every category at build fans
  // out enough concurrent Woo REST calls (list + all products per
  // category) across build workers that WordPress.com trips 429.
  // Pages render on-demand on first visit and cache via ISR (see
  // `revalidate`), so we still get static behaviour without hammering
  // Woo during the build. Same pattern as /product/[slug].
  return [];
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = await CategoriesService.getBySlug(slug);
  if (!cat) return buildMetadata({ title: "Category not found" });
  return buildMetadata({
    title: cat.name,
    description: cat.description,
    path: `/category/${cat.slug}`,
    images: cat.image?.src ? [cat.image.src] : undefined,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await CategoriesService.getBySlug(slug).catch(() => null);
  if (!category) notFound();

  const categories = await CategoriesService.list().catch(() => []);

  return (
    <div className="container-page py-16 md:py-24">
      <Reveal>
        <div className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.32em] text-primary">
            Category · {category.count ?? 0} compounds
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            {category.name}.
          </h1>
          {category.description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>
      </Reveal>

      {/* Filter + sort bar */}
      <Reveal delay={0.08}>
        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 md:flex-wrap md:overflow-visible">
            <Link
              href="/shop/all"
              className={cn(
                "shrink-0 rounded-full border border-border bg-background-elevated px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70 transition-all",
                "hover:border-border-strong hover:bg-background-muted hover:text-foreground",
              )}
            >
              All
            </Link>
            {categories.map((c) => {
              const active = c.slug === category.slug;
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                    active
                      ? "text-white shadow-[0_10px_24px_-10px_hsl(var(--brand-500)/0.55)]"
                      : "border border-border bg-background-elevated text-foreground/70 hover:border-border-strong hover:bg-background-muted hover:text-foreground",
                  )}
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                        }
                      : undefined
                  }
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
          <ProductSort />
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <FilteredProducts
              categoryId={category.id}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </Reveal>
    </div>
  );
}

async function FilteredProducts({
  categoryId,
  searchParams,
}: {
  categoryId: number;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const parsed = parseProductSearchParams(sp);
  const { data, totalPages, page } = await ProductsService.list({
    ...parsed,
    category: String(categoryId),
  });

  return (
    <>
      <ProductGrid products={data} priorityCount={4} />
      <div className="mt-16">
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </>
  );
}

