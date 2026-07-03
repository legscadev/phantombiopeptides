"use client";

import * as React from "react";
import { toast } from "sonner";
import type { WCCart } from "@/types";
import {
  addToCartAction,
  getCartAction,
  removeCartItemAction,
  updateCartItemAction,
  applyCouponAction,
  removeCouponAction,
} from "@/app/actions/cart";

interface CartContextValue {
  cart: WCCart | null;
  itemCount: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  refresh: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: WCCart | null;
  children: React.ReactNode;
}) {
  const [cart, setCart] = React.useState<WCCart | null>(initialCart);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const withLoading = React.useCallback(
    async (fn: () => Promise<WCCart>) => {
      setIsLoading(true);
      try {
        const next = await fn();
        setCart(next);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const value = React.useMemo<CartContextValue>(
    () => ({
      cart,
      itemCount: cart?.items_count ?? 0,
      isLoading,
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      refresh: () =>
        withLoading(async () => {
          const next = await getCartAction();
          return next;
        }),
      addItem: async (productId, quantity = 1) => {
        await withLoading(() => addToCartAction(productId, quantity));
        toast.success("Added to cart");
        setIsDrawerOpen(true);
      },
      updateItem: async (key, quantity) => {
        await withLoading(() => updateCartItemAction(key, quantity));
      },
      removeItem: async (key) => {
        await withLoading(() => removeCartItemAction(key));
        toast("Item removed");
      },
      applyCoupon: async (code) => {
        try {
          await withLoading(() => applyCouponAction(code));
          toast.success(`Coupon "${code}" applied`);
        } catch {
          toast.error("Coupon could not be applied");
        }
      },
      removeCoupon: async (code) => {
        await withLoading(() => removeCouponAction(code));
      },
    }),
    [cart, isLoading, isDrawerOpen, withLoading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
