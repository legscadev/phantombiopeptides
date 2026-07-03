import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="relative overflow-hidden border-b border-border/50 bg-background/50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="container-page relative">
        <div className="flex h-9 items-center justify-center gap-2 text-xs text-muted-foreground">
          <Truck className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
          <span>
            Complimentary cold-chain shipping on orders over{" "}
            <span className="text-foreground font-medium">$150</span>
          </span>
          <span className="mx-2 hidden sm:inline-block">·</span>
          <span className="hidden sm:inline-block">
            HPLC-verified purity · Third-party tested
          </span>
        </div>
      </div>
    </div>
  );
}
