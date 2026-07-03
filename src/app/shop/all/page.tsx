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
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(60% 55% at 22% 30%, hsl(264 100% 22%) 0%, transparent 55%), radial-gradient(45% 45% at 82% 68%, hsl(280 85% 14%) 0%, transparent 70%), linear-gradient(180deg, #07040e 0%, #050309 100%)",
      }}
    >
      {/* faint grid overlay */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        aria-hidden
      >
        <defs>
          <pattern
            id="shop-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="white"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#shop-grid)" />
      </svg>

      <div className="container-page relative z-10 py-16 md:py-24">
        <Reveal>
          <>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/45">
              The catalog · {totalItems} compounds
            </p>
            <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              All peptides &amp; compounds.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60">
              Every compound HPLC-verified, third-party tested, and same-day
              dispatched. Discreet packaging, world-wide.
            </p>
          </>
        </Reveal>

        {/* Filter + sort bar */}
        <Reveal delay={0.08}>
          <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="no-scrollbar -mx-2 flex items-center gap-2 overflow-x-auto px-2 pb-1 md:flex-wrap md:overflow-visible">
              <Link
                href="/shop/all"
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all",
                  "bg-white text-[#07040e] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.5)]",
                )}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className={cn(
                    "shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-all",
                    "hover:border-white/40 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="[&_[data-slot=select-trigger]]:border-white/20 [&_[data-slot=select-trigger]]:bg-white/[0.04] [&_[data-slot=select-trigger]]:text-white [&_label]:text-white/60">
              <ProductSort />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-12">
            <Suspense fallback={<GridSkeleton />}>
              <ProductGrid products={data} priorityCount={4} />
            </Suspense>

            <div className="mt-16 [&_a]:!text-white/80 [&_a:hover]:!text-white [&_button]:!text-white/80 [&_button[aria-current='page']]:!bg-white [&_button[aria-current='page']]:!text-[#07040e]">
              <Pagination page={page} totalPages={totalPages} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square bg-white/10" />
          <Skeleton className="h-4 w-2/3 bg-white/10" />
          <Skeleton className="h-4 w-1/3 bg-white/10" />
        </div>
      ))}
    </div>
  );
}
