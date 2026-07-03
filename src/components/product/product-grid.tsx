import { ProductCard } from "./product-card";
import type { WCProduct } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  products: WCProduct[];
  className?: string;
  priorityCount?: number;
}

export function ProductGrid({ products, className, priorityCount = 0 }: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <p className="text-lg font-medium">No products found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          priority={i < priorityCount}
        />
      ))}
    </div>
  );
}
