import { Suspense } from "react";
import { ProductsService } from "@/services/products";
import { CategoriesService } from "@/services/categories";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import { ProductFilters } from "@/components/product/product-filters";
import { Pagination } from "@/components/product/pagination";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Reveal } from "@/components/common/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata } from "@/lib/seo";
import { parseProductSearchParams } from "@/lib/parse-search";

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
  const [{ data, totalPages, totalItems, page }, categories] = await Promise.all([
    ProductsService.list(params).catch(() => emptyList),
    CategoriesService.list().catch(() => []),
  ]);

  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <>
          <Breadcrumb
            crumbs={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "All products" },
            ]}
          />

          <div className="mt-6 flex flex-col gap-3 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                All products
              </h1>
              <p className="mt-2 text-muted-foreground">
                {totalItems} compounds · HPLC-verified · Third-party tested
              </p>
            </div>
            <ProductSort />
          </div>
        </>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <Reveal delay={0.08}>
          <ProductFilters categories={categories} className="hidden lg:block" />
        </Reveal>

        <Reveal delay={0.16}>
          <div>
            <Suspense fallback={<GridSkeleton />}>
              <ProductGrid products={data} priorityCount={4} />
            </Suspense>

            <div className="mt-12">
              <Pagination page={page} totalPages={totalPages} />
            </div>
          </div>
        </Reveal>
      </div>
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
