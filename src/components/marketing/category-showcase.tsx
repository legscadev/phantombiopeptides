import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/common/section";
import { Button } from "@/components/ui/button";
import type { WCCategory } from "@/types";

export function CategoryShowcase({ categories }: { categories: WCCategory[] }) {
  const items = categories.slice(0, 8);
  if (items.length === 0) return null;
  return (
    <Section
      eyebrow="Shop by category"
      title="Curated by research area."
      description="Filter our catalog by the outcome you're studying."
      actions={
        <Button variant="outline" asChild>
          <Link href="/shop">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="-mx-4 overflow-x-auto pb-2 no-scrollbar sm:mx-0">
        <ul className="flex gap-4 px-4 sm:px-0">
          {items.map((cat) => (
            <li key={cat.id} className="w-[260px] shrink-0 sm:w-[300px]">
              <Link
                href={`/category/${cat.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-[0_20px_50px_-15px_hsl(264_100%_40%/0.35)]"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-fuchsia-500 to-primary" />
                <div className="relative aspect-[4/5] overflow-hidden bg-background-muted">
                  {cat.image?.src && (
                    <Image
                      src={cat.image.src}
                      alt={cat.image.alt || cat.name}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="absolute left-3 top-3 rounded-md bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
                    {cat.count ?? 0} items
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-primary">
                    {cat.name}
                  </p>
                  <h3 className="mt-2 text-lg font-bold">{cat.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {cat.description || "Research compounds in this category."}
                  </p>
                  <span
                    className="mt-4 inline-flex w-fit items-center gap-1 rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(264 100% 40%) 0%, hsl(280 100% 34%) 100%)",
                    }}
                  >
                    View <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
