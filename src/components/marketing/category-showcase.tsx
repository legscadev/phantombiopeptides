import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DarkSection } from "@/components/common/dark-section";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import type { WCCategory } from "@/types";

/**
 * Horizontally scrollable category rail on the brand-black surface —
 * matches the "Shop by Category" band from the EVO reference. Each
 * tile is a translucent glass panel with the category vial floated
 * inside a soft brand gradient plinth.
 */
export function CategoryShowcase({ categories }: { categories: WCCategory[] }) {
  const items = categories.slice(0, 10);
  if (items.length === 0) return null;
  return (
    <DarkSection
      eyebrow="Explore the catalog"
      title="Shop by category."
      description="Filter our catalog by the outcome you're studying."
      actions={
        <Button
          variant="outline"
          asChild
          className="border-white/25 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:text-white"
        >
          <Link href="/shop">
            View all products <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="no-scrollbar -mx-4 overflow-x-auto pb-2 sm:mx-0">
        <ul className="flex gap-5 px-4 sm:px-0">
          {items.map((cat, idx) => (
            <li key={cat.id} className="w-[280px] shrink-0 sm:w-[320px]">
              <Reveal delay={Math.min(idx * 0.08, 0.32)}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="glass-dark ring-glass-dark group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-300))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]"
                >
                  {/* Image plinth */}
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(75% 60% at 50% 25%, hsl(var(--brand-400) / 0.45) 0%, hsl(var(--brand-500) / 0.18) 55%, transparent 82%)",
                      }}
                      aria-hidden
                    />
                    {cat.image?.src && (
                      <Image
                        src={cat.image.src}
                        alt={cat.image.alt || cat.name}
                        fill
                        sizes="320px"
                        className="animate-float object-contain p-6 transition-transform duration-700 group-hover:scale-[1.05]"
                        style={{ animationDuration: "9s" }}
                      />
                    )}
                    {/* Item count chip */}
                    <div className="glass-dark absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      {cat.count ?? 0} items
                    </div>
                    {/* Bottom fade so text below reads */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
                      aria-hidden
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-300))]">
                      Category
                    </p>
                    <h3 className="mt-2 font-display text-lg font-extrabold tracking-tight text-white">
                      {cat.name}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/60">
                      {cat.description || "Research compounds in this category."}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[color:hsl(var(--brand-300))] transition-transform duration-300 group-hover:translate-x-0.5">
                      Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </DarkSection>
  );
}
