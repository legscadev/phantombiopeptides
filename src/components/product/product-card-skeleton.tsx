import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  variant?: "light" | "dark";
}

export function ProductCardSkeleton({
  variant = "light",
}: ProductCardSkeletonProps) {
  const isDark = variant === "dark";
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-3xl backdrop-blur-md",
        isDark
          ? "bg-white/[0.04] ring-1 ring-white/10 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.7)]"
          : "bg-white/70 ring-1 ring-black/5 shadow-[0_10px_30px_-15px_rgba(9,4,24,0.15)]",
      )}
    >
      <Skeleton
        className={cn(
          "aspect-[4/5] w-full rounded-none",
          isDark ? "!bg-white/[0.06]" : undefined,
        )}
      />

      <div className="flex flex-col gap-1.5 p-5">
        <Skeleton
          className={cn(
            "h-2.5 w-24 rounded-full",
            isDark ? "!bg-white/[0.08]" : undefined,
          )}
        />
        <Skeleton
          className={cn(
            "mt-1 h-5 w-4/5",
            isDark ? "!bg-white/[0.08]" : undefined,
          )}
        />
        <Skeleton
          className={cn(
            "h-3.5 w-full",
            isDark ? "!bg-white/[0.06]" : undefined,
          )}
        />
        <Skeleton
          className={cn(
            "h-3.5 w-2/3",
            isDark ? "!bg-white/[0.06]" : undefined,
          )}
        />
        <div className="mt-auto flex items-end justify-between pt-4">
          <Skeleton
            className={cn(
              "h-6 w-20",
              isDark ? "!bg-white/[0.08]" : undefined,
            )}
          />
          <Skeleton
            className={cn(
              "h-10 w-20 rounded-full",
              isDark ? "!bg-white/[0.08]" : undefined,
            )}
          />
        </div>
      </div>
    </div>
  );
}

interface ProductGridSkeletonProps {
  count?: number;
  variant?: "light" | "dark";
  className?: string;
}

export function ProductGridSkeleton({
  count = 8,
  variant = "light",
  className,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
