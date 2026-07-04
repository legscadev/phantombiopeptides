import { ProductCard } from "./product-card";
import type { WCProduct } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  products: WCProduct[];
  className?: string;
  priorityCount?: number;
  variant?: "light" | "dark";
}

export function ProductGrid({
  products,
  className,
  priorityCount = 0,
  variant = "light",
}: Props) {
  if (products.length === 0) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-dashed p-16 text-center",
          variant === "dark"
            ? "border-white/15 bg-white/[0.03] text-white/80"
            : "border-border bg-card",
        )}
      >
        <p className="text-lg font-medium">No products found</p>
        <p
          className={cn(
            "mt-2 text-sm",
            variant === "dark" ? "text-white/50" : "text-muted-foreground",
          )}
        >
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
          variant={variant}
        />
      ))}
    </div>
  );
}
