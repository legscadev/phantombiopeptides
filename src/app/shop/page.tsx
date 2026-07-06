import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CategoriesService } from "@/services/categories";
import { ProductsService } from "@/services/products";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Reveal } from "@/components/common/reveal";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Shop research peptides",
  description:
    "Explore our peptide catalog by research area — GLP-1, cytoprotective, cognitive, longevity, and more.",
  path: "/shop",
});

export const revalidate = 300;

export default async function ShopPage() {
  const [categories, totalRes] = await Promise.all([
    CategoriesService.list().catch(() => []),
    ProductsService.list({ per_page: 1 }).catch(() => ({
      data: [],
      totalItems: 0,
      totalPages: 1,
      page: 1,
      perPage: 0,
    })),
  ]);

  const totalCount = categories.reduce((s, c) => s + (c.count ?? 0), 0) || totalRes.totalItems;

  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <>
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

          <div className="mt-6 flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
                The catalog
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                All peptides &amp; compounds
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                {totalCount} compounds. Every one independently tested. COAs are
                published before you can buy.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/shop/all">
                Browse the flat list <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </>
      </Reveal>

      <Reveal delay={0.08}>
      {categories.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-16 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">Catalog loading</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Once WooCommerce credentials are configured, categories will appear
            here automatically.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/category/${cat.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:border-border-strong hover:shadow-md"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {cat.image?.src ? (
                    <Image
                      src={cat.image.src}
                      alt={cat.image.alt || cat.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <ImagePlaceholder label={cat.name} />
                  )}
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
                    {cat.count ?? 0} items
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-primary">
                    {cat.name}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-extrabold">
                    {cat.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {cat.description || "Research compounds in this category."}
                  </p>
                  <span className="mt-5 inline-flex w-fit items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors group-hover:bg-primary">
                    Explore <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      </Reveal>
    </div>
  );
}
