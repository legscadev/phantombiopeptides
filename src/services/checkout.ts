import "server-only";
import { cookies } from "next/headers";
import { env } from "@/env";
import { wcCheckoutResponseSchema } from "@/schemas/woocommerce";
import { WooError } from "./woocommerce";
import type { WCAddress, WCCheckoutResponse } from "@/types";

const CART_COOKIE = "pl_cart_token";

interface PaymentDataEntry {
  key: string;
  value: string | number | boolean | null;
}

interface CheckoutInput {
  billing_address: WCAddress;
  shipping_address: WCAddress;
  customer_note?: string;
  payment_method: string;
  payment_data: PaymentDataEntry[];
}

/**
 * POSTs the Woo Store API /checkout endpoint. The Store API creates the
 * order, calls the Stripe gateway plugin server-side, and returns the
 * order + payment_result. Stripe secret keys never touch this codebase —
 * they live on WordPress inside the WooCommerce Stripe plugin.
 */
export const CheckoutService = {
  async submit(input: CheckoutInput): Promise<WCCheckoutResponse> {
    if (!env.WC_STORE_URL) {
      throw new WooError("WC_STORE_URL is not configured.", 500);
    }
    const store = await cookies();
    const token = store.get(CART_COOKIE)?.value;
    if (!token) {
      throw new WooError(
        "No active cart session. Add items to the cart before checking out.",
        400,
      );
    }

    const url = `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-json/${env.WC_STORE_API_VERSION}/checkout`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cart-Token": token,
      },
      body: JSON.stringify(input),
      cache: "no-store",
    });

    // Refresh the token if Woo rotates it.
    const newToken =
      res.headers.get("cart-token") ?? res.headers.get("Cart-Token");
    if (newToken && newToken !== token) {
      store.set(CART_COOKIE, newToken, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        secure: process.env.NODE_ENV === "production",
      });
    }

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* empty */
    }

    if (!res.ok) {
      const message =
        (body as { message?: string } | null)?.message ??
        `Checkout failed: ${res.status} ${res.statusText}`;
      throw new WooError(message, res.status, JSON.stringify(body));
    }

    return wcCheckoutResponseSchema.parse(body);
  },
};
