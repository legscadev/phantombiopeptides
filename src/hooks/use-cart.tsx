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
  addItem: (
    productId: number,
    quantity?: number,
    variation?: Array<{ attribute: string; value: string }>,
    variationId?: number,
  ) => Promise<void>;
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

  // Root layout intentionally doesn't hydrate the cart server-side
  // (calling cookies() there would force every route dynamic). Sync
  // from the cookie once on mount so the badge/drawer reflect the
  // real state without a page refresh.
  React.useEffect(() => {
    if (initialCart !== null) return;
    getCartAction()
      .then((next) => setCart(next))
      .catch(() => {
        /* stay on null → 0 items */
      });
  }, [initialCart]);

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
      addItem: async (productId, quantity = 1, variation, variationId) => {
        await withLoading(() =>
          addToCartAction(productId, quantity, variation, variationId),
        );
        toast.success("Added to cart");
      },
      updateItem: async (key, quantity) => {
        await withLoading(() => updateCartItemAction(key, quantity));
      },
      removeItem: async (key) => {
        await withLoading(() => removeCartItemAction(key));
        toast("Item removed");
      },
      applyCoupon: async (code) => {
        setIsLoading(true);
        try {
          const result = await applyCouponAction(code);
          if (result.ok) {
            setCart(result.cart);
            toast.success(`Coupon "${code.toUpperCase()}" applied`);
          } else {
            toast.error(result.error);
          }
        } finally {
          setIsLoading(false);
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
