import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CategoriesService } from "@/services/categories";
import { ProductsService } from "@/services/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import { ProductFilters } from "@/components/product/product-filters";
import { Pagination } from "@/components/product/pagination";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { buildMetadata } from "@/lib/seo";
import { parseProductSearchParams } from "@/lib/parse-search";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  try {
    const slugs = await CategoriesService.getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
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
  const category = await CategoriesService.getBySlug(slug);
  if (!category) notFound();

  const categories = await CategoriesService.list();

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      <div className="mt-6 flex flex-col gap-3 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Category
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {category.description || `${category.count ?? 0} compounds available.`}
          </p>
        </div>
        <ProductSort />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <ProductFilters
          categories={categories}
          activeCategorySlug={category.slug}
          className="hidden lg:block"
        />
        <div>
          <Suspense fallback={<GridSkeleton />}>
            <FilteredProducts
              categoryId={category.id}
              searchParams={searchParams}
            />
          </Suspense>
        </div>
      </div>
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
      <div className="mt-12">
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </>
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
