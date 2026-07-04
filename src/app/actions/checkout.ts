"use server";

import { revalidatePath } from "next/cache";
import { CartService } from "@/services/cart";
import { CheckoutService } from "@/services/checkout";
import { requireStripe } from "@/lib/stripe-server";
import { wc, WooError } from "@/services/woocommerce";
import type { WCAddress } from "@/types";

export interface StartCheckoutInput {
  billing_address: WCAddress;
  shipping_address: WCAddress;
  customer_note?: string;
}

export interface StartCheckoutResult {
  ok: boolean;
  error?: string;
  order_id?: number;
  client_secret?: string;
  payment_intent_id?: string;
}

/**
 * 1. Create the Woo order (status: pending) via the authenticated REST API.
 * 2. Create a Stripe PaymentIntent for the cart total with the order id
 *    in metadata.
 * 3. Return the client_secret so the browser can confirm the payment
 *    against Stripe (which supports Card / Apple Pay / Google Pay / Link
 *    through the Payment Element automatically).
 */
export async function startCheckoutAction(
  input: StartCheckoutInput,
): Promise<StartCheckoutResult> {
  try {
    const stripe = requireStripe();

    // Read the live cart so amount + line items always match what the
    // customer sees, not something the client sends.
    const cart = await CartService.get();
    if (cart.items.length === 0) {
      return { ok: false, error: "Your cart is empty." };
    }

    const total = parseFloat(cart.totals.total_price) || 0;
    if (total <= 0) {
      return { ok: false, error: "Cart total is zero." };
    }

    // Woo order in "pending" — payment is not yet captured.
    const order = await CheckoutService.submit({
      billing_address: input.billing_address,
      shipping_address: input.shipping_address,
      customer_note: input.customer_note ?? "",
      payment_method: "stripe",
      payment_data: [],
    });

    const minorUnits = cart.totals.currency_minor_unit ?? 2;
    const amountMinor = Math.round(total * 10 ** minorUnits);
    const currency = (cart.totals.currency_code || "USD").toLowerCase();

    const pi = await stripe.paymentIntents.create({
      amount: amountMinor,
      currency,
      // Enable Card + wallets (Apple Pay, Google Pay, Link) without
      // hardcoding a list — Stripe picks the eligible methods based on
      // amount, currency, and account settings.
      automatic_payment_methods: { enabled: true },
      metadata: {
        woo_order_id: String(order.order_id),
        source: "phantombiopeptides-nextjs",
      },
      description: `Order #${order.order_id} — Phantom Bio Peptides`,
    });

    return {
      ok: true,
      order_id: order.order_id,
      client_secret: pi.client_secret ?? undefined,
      payment_intent_id: pi.id,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout could not be started.";
    return { ok: false, error: message };
  }
}

/**
 * Called by the browser after `stripe.confirmPayment` returns succeeded.
 * We independently verify the PaymentIntent status against Stripe, then
 * flip the Woo order to "processing" and clear the cart.
 */
export async function finalizeCheckoutAction(
  orderId: number,
  paymentIntentId: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const stripe = requireStripe();
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== "succeeded") {
      return {
        ok: false,
        error: `Payment not completed (status: ${pi.status}).`,
      };
    }
    if (String(pi.metadata.woo_order_id) !== String(orderId)) {
      return { ok: false, error: "Order / payment mismatch." };
    }

    await wc(`/orders/${orderId}`, {
      method: "PUT",
      revalidate: false,
      body: JSON.stringify({
        status: "processing",
        set_paid: true,
        transaction_id: pi.id,
      }),
    } as never);

    await CartService.clear();
    revalidatePath("/cart");
    return { ok: true };
  } catch (err) {
    if (err instanceof WooError) {
      return { ok: false, error: err.message };
    }
    const message =
      err instanceof Error ? err.message : "Failed to finalize checkout.";
    return { ok: false, error: message };
  }
}
