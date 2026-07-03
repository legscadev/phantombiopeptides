import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
import type { WCCategory } from "@/types";

export function CategoryShowcase({ categories }: { categories: WCCategory[] }) {
  return (
    <Section
      eyebrow="Categories"
      title="Curated by research area."
      description="Filter our catalog by the outcome you're studying — recovery, longevity, metabolic, cognitive, and more."
      actions={
        <Button variant="outline" asChild>
          <Link href="/shop">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.slice(0, 6).map((cat, i) => (
          <Reveal key={cat.id} delay={i * 0.05}>
            <Link
              href={`/category/${cat.slug}`}
              className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card"
            >
              {cat.image?.src && (
                <Image
                  src={cat.image.src}
                  alt={cat.image.alt || cat.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover opacity-40 transition-all duration-700 group-hover:opacity-60 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
              <div className="relative flex items-end justify-between p-6">
                <div>
                  <h3 className="text-xl font-semibold">{cat.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="mt-3 inline-block text-[11px] uppercase tracking-[0.16em] text-primary">
                    {cat.count} products
                  </span>
                </div>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-background-elevated transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
