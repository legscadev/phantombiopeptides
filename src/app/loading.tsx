import { Skeleton } from "@/components/ui/skeleton";
import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";

export default function Loading() {
  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-3xl space-y-5">
        <Skeleton className="h-3 w-48 rounded-full" />
        <Skeleton className="h-14 w-full max-w-2xl" />
        <Skeleton className="h-14 w-4/5 max-w-xl" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
