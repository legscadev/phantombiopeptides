"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { DarkSection } from "@/components/common/dark-section";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WCCategory } from "@/types";

/**
 * Horizontally scrollable category rail on the brand-black surface.
 * Carousel controls: chevron buttons (desktop) advance one card at a
 * time; dot indicators below let the reader jump directly. Native
 * touch-swipe still works everywhere.
 */
export function CategoryShowcase({ categories }: { categories: WCCategory[] }) {
  const items = categories.slice(0, 10);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [canLeft, setCanLeft] = React.useState(false);
  const [canRight, setCanRight] = React.useState(true);

  const measure = React.useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 4;
    setCanLeft(scrollLeft > 4);
    setCanRight(!atEnd);
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    // At the right edge, the last card's left edge is further from
    // scrollLeft than earlier cards, so "closest to scrollLeft" picks
    // the wrong dot. Snap to the last index in that case.
    if (atEnd) {
      setActiveIndex(children.length - 1);
      return;
    }
    // Otherwise pick whichever card's centre is nearest the viewport
    // centre — that tracks well through the middle of the rail.
    const viewportCentre = scrollLeft + clientWidth / 2;
    let closest = 0;
    let best = Infinity;
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      const centre = c.offsetLeft + c.offsetWidth / 2;
      const diff = Math.abs(centre - viewportCentre);
      if (diff < best) {
        best = diff;
        closest = i;
      }
    }
    setActiveIndex(closest);
  }, []);

  React.useEffect(() => {
    measure();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function shift(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const gap = 20; // matches gap-5
    const step = first?.offsetWidth
      ? first.offsetWidth + gap
      : el.clientWidth * 0.6;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  function jumpTo(index: number) {
    const el = scrollerRef.current;
    const child = el?.children[index] as HTMLElement | undefined;
    if (!el || !child) return;
    el.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
  }

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
      <div className="relative">
        {/* Left chevron */}
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canLeft}
          aria-label="Scroll categories left"
          className={cn(
            "absolute left-2 top-[40%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/[0.08] text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-300))] disabled:cursor-not-allowed disabled:opacity-25 md:inline-flex",
          )}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>

        {/* Right chevron */}
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canRight}
          aria-label="Scroll categories right"
          className={cn(
            "absolute right-2 top-[40%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/[0.08] text-white backdrop-blur transition-all hover:border-white/40 hover:bg-white/[0.15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-300))] disabled:cursor-not-allowed disabled:opacity-25 md:inline-flex",
          )}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
        </button>

        {/* Rail */}
        <ul
          ref={scrollerRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 sm:mx-0 sm:px-0"
        >
          {items.map((cat, idx) => (
            <li
              key={cat.id}
              className="w-[280px] shrink-0 snap-start sm:w-[320px]"
            >
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
                    <div className="glass-dark absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      {cat.count ?? 0} items
                    </div>
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

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => jumpTo(idx)}
              aria-label={`Go to category ${idx + 1}`}
              aria-current={idx === activeIndex}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-300))] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060606]",
                idx === activeIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/25 hover:bg-white/50",
              )}
            />
          ))}
        </div>
      </div>
    </DarkSection>
  );
}
