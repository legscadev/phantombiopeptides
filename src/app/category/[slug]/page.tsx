import { notFound } from "next/navigation";
import { CategoriesService } from "@/services/categories";
import { ProductsService } from "@/services/products";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductSort } from "@/components/product/product-sort";
import { ProductFilters } from "@/components/product/product-filters";
import { Pagination } from "@/components/product/pagination";
import { Breadcrumb } from "@/components/common/breadcrumb";
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
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const parsed = parseProductSearchParams(sp);
  const category = await CategoriesService.getBySlug(slug);
  if (!category) notFound();

  const [{ data, totalPages, totalItems, page }, categories] = await Promise.all([
    ProductsService.list({ ...parsed, category: category.slug }),
    CategoriesService.list(),
  ]);

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
            {category.description || `${totalItems} compounds available.`}
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
          <ProductGrid products={data} priorityCount={4} />
          <div className="mt-12">
            <Pagination page={page} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
