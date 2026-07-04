"use client";

import * as React from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoseSelector } from "./dose-selector";
import { WishlistButton } from "./wishlist-button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import type { WCProduct, WCVariation } from "@/types";

export function PurchasePanel({
  product,
  variations = [],
}: {
  product: WCProduct;
  variations?: WCVariation[];
}) {
  const { addItem, isLoading } = useCart();

  // Product-side attribute (e.g. "Dosage" with options ["5 mg", "10 mg"])
  const doseAttr = product.attributes.find(
    (a) =>
      a.name.toLowerCase() === "dose" || a.name.toLowerCase() === "dosage",
  );
  const doses = doseAttr?.options ?? [];

  const isVariable = product.type === "variable";

  const [dose, setDose] = React.useState(doses[0] ?? "");

  // Find the specific variation matching the currently-selected dose so
  // the sticker price, stock status, and add-to-cart target reflect
  // what the customer actually picked.
  const selectedVariation = React.useMemo(() => {
    if (!isVariable || variations.length === 0 || !dose) return null;
    const norm = (s: string) => s.trim().toLowerCase();
    return (
      variations.find((v) =>
        v.attributes.some(
          (a) =>
            (a.name.toLowerCase() === "dose" ||
              a.name.toLowerCase() === "dosage") &&
            norm(a.option) === norm(dose),
        ),
      ) ?? null
    );
  }, [isVariable, variations, dose]);

  const displayPrice = selectedVariation?.price || product.price;
  const displayRegular =
    selectedVariation?.regular_price || product.regular_price;
  const displayOnSale = Boolean(
    selectedVariation?.on_sale ?? product.on_sale,
  );

  const displayStock =
    selectedVariation?.stock_status ?? product.stock_status;
  const stockQty = selectedVariation
    ? (selectedVariation.stock_quantity ?? null)
    : (product.stock_quantity ?? null);
  const outOfStock = displayStock === "outofstock";
  const missingPrice =
    !displayPrice || displayPrice === "0" || displayPrice === "";
  const missingDose = isVariable && doses.length > 1 && !dose;

  const handleAdd = () => {
    if (!displayPrice || missingPrice) return;
    const variation =
      isVariable && doseAttr && dose
        ? [{ attribute: doseAttr.name, value: dose }]
        : undefined;
    return addItem(product.id, 1, variation, selectedVariation?.id);
  };

  return (
    <div className="space-y-5">
      {doses.length > 1 && (
        <DoseSelector
          options={doses}
          value={dose}
          onChange={setDose}
          label={doseAttr?.name ?? "Dose"}
        />
      )}

      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-semibold tracking-tight">
          {missingPrice ? "—" : formatPrice(displayPrice)}
        </span>
        {displayOnSale && !missingPrice && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(displayRegular)}
          </span>
        )}
      </div>

      <div className="text-sm">
        <span
          className={
            outOfStock
              ? "text-destructive"
              : displayStock === "onbackorder"
                ? "text-warning"
                : "text-success"
          }
        >
          {outOfStock
            ? "Out of stock"
            : displayStock === "onbackorder"
              ? "Available on backorder"
              : `In stock${stockQty ? ` — ${stockQty} units` : ""}`}
        </span>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Button
          size="lg"
          disabled={
            outOfStock || isLoading || missingDose || missingPrice
          }
          onClick={handleAdd}
          className="flex-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              {outOfStock
                ? "Out of stock"
                : missingPrice
                  ? "Coming soon"
                  : "Add to cart"}
            </>
          )}
        </Button>
        <WishlistButton
          product={{ id: product.id, slug: product.slug, name: product.name }}
        />
      </div>
    </div>
  );
}
