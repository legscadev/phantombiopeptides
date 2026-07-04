import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import type { WCCategory } from "@/types";

/**
 * Glass category tiles. Each card is a light frosted surface with the
 * category vial floated inside a soft brand-gradient plinth, an "Explore
 * →" affordance, and a subtle lift on hover.
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
        <ul className="flex gap-5 px-4 sm:px-0">
          {items.map((cat, idx) => (
            <li key={cat.id} className="w-[260px] shrink-0 sm:w-[300px]">
              <Reveal delay={Math.min(idx * 0.08, 0.3)}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="glass ring-glass group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2"
                >
                  {/* Image plinth with brand-gradient overlay */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(75% 60% at 50% 25%, hsl(var(--brand-400) / 0.28) 0%, hsl(var(--brand-500) / 0.10) 55%, transparent 80%)",
                      }}
                      aria-hidden
                    />
                    {cat.image?.src && (
                      <Image
                        src={cat.image.src}
                        alt={cat.image.alt || cat.name}
                        fill
                        sizes="300px"
                        className="animate-float object-contain p-6 transition-transform duration-700 group-hover:scale-[1.04]"
                        style={{ animationDuration: "9s" }}
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/60 to-transparent" aria-hidden />
                    <div className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground">
                      {cat.count ?? 0} items
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                      Category
                    </p>
                    <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight text-foreground">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {cat.description || "Research compounds in this category."}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[color:hsl(var(--brand-500))] transition-transform duration-300 group-hover:translate-x-0.5">
                      Explore <ArrowUpRight className="h-3.5 w-3.5" />
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
