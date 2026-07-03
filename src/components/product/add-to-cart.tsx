"use client";

import * as React from "react";
import { Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { WCProduct } from "@/types";

interface Props {
  product: WCProduct;
}

export function AddToCart({ product }: Props) {
  const { addItem, isLoading } = useCart();
  const [qty, setQty] = React.useState(1);
  const outOfStock = product.stock_status === "outofstock";
  const max =
    product.manage_stock && product.stock_quantity
      ? product.stock_quantity
      : 99;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-full border border-border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          className="flex h-11 w-11 items-center justify-center text-muted-foreground disabled:opacity-40 hover:text-foreground"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-sm font-medium">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(max, q + 1))}
          className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:text-foreground"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
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
            {outOfStock ? "Out of stock" : "Add to cart"}
          </>
        )}
      </Button>
    </div>
  );
}
