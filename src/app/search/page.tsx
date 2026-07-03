import { Search as SearchIcon } from "lucide-react";
import { ProductsService } from "@/services/products";
import { ProductGrid } from "@/components/product/product-grid";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams;
  return buildMetadata({
    title: q ? `Search: ${q}` : "Search",
    description: `Search results for "${q ?? ""}"`,
    path: `/search${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const { data, totalItems } = q
    ? await ProductsService.list({ search: q, per_page: 24 })
    : { data: [], totalItems: 0 };

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="mt-6 flex items-center gap-3">
        <SearchIcon className="h-5 w-5 text-primary" />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {q ? `Results for "${q}"` : "Search"}
        </h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        {q
          ? `${totalItems} matching product${totalItems === 1 ? "" : "s"}.`
          : "Enter a search term in the navigation bar to find compounds."}
      </p>

      <div className="mt-10">
        <ProductGrid products={data} />
      </div>
    </div>
  );
}
