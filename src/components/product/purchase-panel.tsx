"use client";

import * as React from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DoseSelector } from "./dose-selector";
import { WishlistButton } from "./wishlist-button";
import { useCart } from "@/hooks/use-cart";
import type { WCProduct } from "@/types";

export function PurchasePanel({ product }: { product: WCProduct }) {
  const { addItem, isLoading } = useCart();
  const doseAttr = product.attributes.find(
    (a) => a.name.toLowerCase() === "dose" || a.name.toLowerCase() === "dosage",
  );
  const doses = doseAttr?.options ?? [];
  const [dose, setDose] = React.useState(doses[0] ?? "");

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

      <div className="flex items-center gap-2">
        <Button
          size="lg"
          disabled={outOfStock || isLoading}
          onClick={() => addItem(product.id, 1)}
          className="flex-1"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              {outOfStock ? "Out of stock" : "Add to cart"}
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
