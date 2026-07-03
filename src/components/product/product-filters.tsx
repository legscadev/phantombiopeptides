"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { WCCategory } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  categories: WCCategory[];
  activeCategorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  className?: string;
}

const PRICE_BUCKETS = [
  { label: "Under $75", min: 0, max: 75 },
  { label: "$75 – $125", min: 75, max: 125 },
  { label: "$125 – $175", min: 125, max: 175 },
  { label: "$175+", min: 175, max: 999 },
];

export function ProductFilters({
  categories,
  activeCategorySlug,
  className,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const onSale = params.get("on_sale") === "true";
  const inStock = params.get("stock_status") === "instock";
  const activePriceMin = params.get("min_price");
  const activePriceMax = params.get("max_price");

  function toggle(key: string, value: string, on: boolean) {
    const sp = new URLSearchParams(params.toString());
    if (on) sp.set(key, value);
    else sp.delete(key);
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  }

  function setPrice(min: number, max: number) {
    const sp = new URLSearchParams(params.toString());
    sp.set("min_price", String(min));
    sp.set("max_price", String(max));
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters =
    onSale || inStock || activePriceMin || activePriceMax || activeCategorySlug;

  return (
    <aside className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Refine</h3>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Categories
        </p>
        <ul className="space-y-1">
          <li>
            <Link
              href="/shop"
              className={cn(
                "block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-background-elevated hover:text-foreground",
                !activeCategorySlug && "bg-background-elevated text-foreground",
              )}
            >
              All
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-background-elevated hover:text-foreground",
                  activeCategorySlug === c.slug &&
                    "bg-background-elevated text-foreground",
                )}
              >
                <span>{c.name}</span>
                <span className="text-xs text-muted-foreground">
                  {c.count ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Price
        </p>
        <ul className="space-y-1">
          {PRICE_BUCKETS.map((b) => {
            const active =
              activePriceMin === String(b.min) &&
              activePriceMax === String(b.max);
            return (
              <li key={b.label}>
                <button
                  type="button"
                  onClick={() => setPrice(b.min, b.max)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm text-foreground/80 hover:bg-background-elevated hover:text-foreground",
                    active && "bg-background-elevated text-foreground",
                  )}
                >
                  {b.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Availability
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Checkbox
              id="in-stock"
              checked={inStock}
              onCheckedChange={(v) => toggle("stock_status", "instock", !!v)}
            />
            <Label htmlFor="in-stock" className="cursor-pointer">
              In stock
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="on-sale"
              checked={onSale}
              onCheckedChange={(v) => toggle("on_sale", "true", !!v)}
            />
            <Label htmlFor="on-sale" className="cursor-pointer">
              On sale
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
