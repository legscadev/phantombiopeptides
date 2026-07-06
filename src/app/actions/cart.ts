"use server";

import { revalidatePath } from "next/cache";
import { CartService, CouponError } from "@/services/cart";
import type { WCCart } from "@/types";

export async function addToCartAction(
  productId: number,
  quantity = 1,
  variation?: Array<{ attribute: string; value: string }>,
  variationId?: number,
): Promise<WCCart> {
  const cart = await CartService.addItem(
    productId,
    quantity,
    variation,
    variationId,
  );
  revalidatePath("/cart");
  return cart;
}

export async function updateCartItemAction(
  key: string,
  quantity: number,
): Promise<WCCart> {
  const cart = await CartService.updateItem(key, quantity);
  revalidatePath("/cart");
  return cart;
}

export async function removeCartItemAction(key: string): Promise<WCCart> {
  const cart = await CartService.removeItem(key);
  revalidatePath("/cart");
  return cart;
}

export type ApplyCouponResult =
  | { ok: true; cart: WCCart }
  | { ok: false; error: string; code: CouponError["code"] };

export async function applyCouponAction(
  code: string,
): Promise<ApplyCouponResult> {
  try {
    const cart = await CartService.applyCoupon(code);
    revalidatePath("/cart");
    return { ok: true, cart };
  } catch (err) {
    if (err instanceof CouponError) {
      return { ok: false, error: err.message, code: err.code };
    }
    return {
      ok: false,
      error: "Coupon could not be applied. Try again in a moment.",
      code: "not_found",
    };
  }
}

export async function removeCouponAction(code: string): Promise<WCCart> {
  const cart = await CartService.removeCoupon(code);
  revalidatePath("/cart");
  return cart;
}

export async function getCartAction(): Promise<WCCart> {
  return CartService.get();
}
