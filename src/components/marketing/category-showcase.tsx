import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import type { WCCategory } from "@/types";

/**
 * Horizontal category rail — EVO-style layout with dramatic vial imagery
 * on colored plinth-style dark card backgrounds. Cards themselves are
 * dark navy so the vial photography pops on the light page.
 */
export function CategoryShowcase({ categories }: { categories: WCCategory[] }) {
  const items = categories.slice(0, 8);
  if (items.length === 0) return null;
  return (
    <Section
      eyebrow="Shop by Category"
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
          {items.map((cat, idx) => (
            <li key={cat.id} className="w-[260px] shrink-0 sm:w-[300px]">
              <Reveal delay={Math.min(idx * 0.08, 0.3)}>
              <Link
                href={`/category/${cat.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-transparent bg-surface-dark text-surface-dark-fg transition-all hover:border-primary/50"
                style={{
                  boxShadow: "0 20px 40px -20px hsl(224 47% 8% / 0.35)",
                }}
              >
                <div
                  className="relative aspect-[4/5] overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(80% 60% at 50% 20%, hsl(264 100% 22%) 0%, hsl(224 47% 8%) 70%)",
                  }}
                >
                  {cat.image?.src && (
                    <Image
                      src={cat.image.src}
                      alt={cat.image.alt || cat.name}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                  )}
                  <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground backdrop-blur">
                    {cat.count ?? 0} items
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: "hsl(264 100% 72%)" }}
                  >
                    {cat.name}
                  </p>
                  <h3 className="mt-2 font-display text-lg font-bold text-white">
                    {cat.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/60">
                    {cat.description || "Research compounds in this category."}
                  </p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                    Shop <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
