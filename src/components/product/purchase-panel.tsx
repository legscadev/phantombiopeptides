"use client";

import * as React from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoseSelector } from "./dose-selector";
import { TieredPricing } from "./tiered-pricing";
import { WishlistButton } from "./wishlist-button";
import { useCart } from "@/hooks/use-cart";
import type { WCProduct } from "@/types";

/**
 * Composed purchase panel: dose toggle + tiered pricing + add-to-cart.
 * The dose selector currently drives display only; when the WooCommerce
 * catalog exposes variable products, we can look up the matching variation
 * id per dose and pass it to CartService.
 */
export function PurchasePanel({ product }: { product: WCProduct }) {
  const { addItem, isLoading } = useCart();
  const doseAttr = product.attributes.find(
    (a) => a.name.toLowerCase() === "dose" || a.name.toLowerCase() === "dosage",
  );
  const doses = doseAttr?.options ?? [];
  const [dose, setDose] = React.useState(doses[0] ?? "");
  const [qty, setQty] = React.useState(1);

  const base = parseFloat(product.price) || 0;
  const outOfStock = product.stock_status === "outofstock";

  return (
    <div className="space-y-6">
      {doses.length > 1 && (
        <DoseSelector
          options={doses}
          value={dose}
          onChange={setDose}
          label={doseAttr?.name ?? "Dose"}
        />
      )}

      <TieredPricing basePrice={base} value={qty} onChange={setQty} />

      <div className="flex items-center gap-2">
        <Button
          size="lg"
          disabled={outOfStock || isLoading}
          onClick={() => addItem(product.id, qty)}
          className="flex-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              {outOfStock ? "Out of stock" : `Add ${qty} to cart`}
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
