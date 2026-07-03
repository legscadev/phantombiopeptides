import { Suspense } from "react";
import Link from "next/link";
import { ProductsService } from "@/services/products";
import { CategoriesService } from "@/services/categories";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import { Pagination } from "@/components/product/pagination";
import { Reveal } from "@/components/common/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata } from "@/lib/seo";
import { parseProductSearchParams } from "@/lib/parse-search";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "All products",
  description: "The full flat list of every compound we carry.",
  path: "/shop/all",
});

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopAllPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = parseProductSearchParams(sp);
  const emptyList = {
    data: [],
    totalPages: 1,
    totalItems: 0,
    page: 1,
    perPage: 0,
  };
  const [{ data, totalPages, totalItems, page }, categories] = await Promise.all(
    [
      ProductsService.list(params).catch(() => emptyList),
      CategoriesService.list().catch(() => []),
    ],
  );

  return (
    <div className="container-page py-16 md:py-24">
      <Reveal>
        <>
          <p className="text-[10px] uppercase tracking-[0.32em] text-primary">
            The catalog · {totalItems} compounds
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            All peptides &amp; compounds.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every compound HPLC-verified, third-party tested, and same-day
            dispatched. Discreet packaging, world-wide.
          </p>
        </>
      </Reveal>

      {/* Filter + sort bar */}
      <Reveal delay={0.08}>
        <div className="mt-12 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 md:flex-wrap md:overflow-visible">
            <Link
              href="/shop/all"
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                "bg-foreground text-background shadow-[0_10px_30px_-10px_hsl(var(--foreground)/0.4)]",
              )}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className={cn(
                  "shrink-0 rounded-full border border-border bg-background-elevated px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/70 transition-all",
                  "hover:border-border-strong hover:bg-background-muted hover:text-foreground",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
          <ProductSort />
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-12">
          <Suspense fallback={<GridSkeleton />}>
            <ProductGrid products={data} priorityCount={4} />
          </Suspense>

          <div className="mt-16">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
