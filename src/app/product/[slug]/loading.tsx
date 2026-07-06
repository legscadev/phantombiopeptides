import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery — 4:5 aspect matches product card + real gallery */}
        <div className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Purchase column */}
        <div className="lg:pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          <div className="mt-4 space-y-3">
            <Skeleton className="h-11 w-full max-w-lg" />
            <Skeleton className="h-11 w-4/5 max-w-md" />
          </div>

          {/* Rating row */}
          <div className="mt-4 flex items-center gap-2">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3.5 w-32" />
          </div>

          {/* Short description */}
          <div className="mt-6 max-w-xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Purchase panel — price + qty + CTA */}
          <div className="mt-8 rounded-2xl border border-border bg-card/60 p-5">
            <Skeleton className="h-8 w-32" />
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="h-11 w-28 rounded-full" />
              <Skeleton className="h-11 flex-1 rounded-full" />
            </div>
          </div>

          {/* Trust badges — 4 tiles matching the real grid */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card/60 p-3"
              >
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="mt-2 h-3.5 w-20" />
                <Skeleton className="mt-1.5 h-3 w-14" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
