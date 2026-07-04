import "server-only";
import { env } from "@/env";
import { CartService } from "./cart";
import { wc, WooError } from "./woocommerce";
import type { WCAddress, WCCheckoutResponse } from "@/types";

interface CheckoutInput {
  billing_address: WCAddress;
  shipping_address: WCAddress;
  customer_note?: string;
  payment_method: string;
  payment_data: Array<{
    key: string;
    value: string | number | boolean | null;
  }>;
  /**
   * When set, use this as the order's WooCommerce status. Default is
   * "pending". Payment-first flows should use "processing".
   */
  status_override?: string;
  /** Marks the order as paid on creation (used after Stripe capture). */
  set_paid?: boolean;
  /** Payment gateway transaction id (e.g. Stripe PaymentIntent id). */
  transaction_id?: string;
}

/**
 * Post the order to WooCommerce via the authenticated REST /orders
 * endpoint. We can't use the Store API /checkout endpoint here because
 * cart persistence isn't reliable on WordPress.com hosting (see the
 * note in CartService). Instead, we build the order from our locally-
 * held cart line items and hand it to Woo as an already-composed
 * order, using the consumer_key/consumer_secret auth that doesn't
 * depend on a guest session.
 *
 * The order is created in the "pending" status. Payment collection
 * still runs client-side via Stripe (or another gateway) — this
 * service only records the order and clears the local cart.
 */
export const CheckoutService = {
  async submit(input: CheckoutInput): Promise<WCCheckoutResponse> {
    const cartItems = await CartService.getLineItems();
    if (cartItems.length === 0) {
      throw new WooError(
        "Your cart is empty. Add items before checking out.",
        400,
      );
    }

    // Extract Stripe payment method ID (if provided) so we can attach it
    // as an order meta value for later reconciliation.
    const stripePmId = input.payment_data.find(
      (d) =>
        d.key === "wc-stripe-payment-method" || d.key === "stripe_source",
    )?.value;

    const line_items = cartItems.map((it) => {
      const line: Record<string, unknown> = {
        product_id: it.id,
        quantity: it.quantity,
      };
      if (it.variation && it.variation.length > 0) {
        line.meta_data = it.variation.map((v) => ({
          key: v.attribute,
          value: v.value,
        }));
      }
      return line;
    });

    // WordPress.com sometimes wpcomsh-fatals when a POST to /orders
    // contains billing/shipping/status/payment fields all at once —
    // likely a plugin hook that stalls. Splitting the write into a
    // minimal POST followed by a PUT for the remaining fields
    // reliably ships past that failure.
    const createResp = await wc<Record<string, unknown>>("/orders", {
      method: "POST",
      revalidate: false,
      body: JSON.stringify({
        status: "pending",
        line_items,
      }),
    } as never);

    const newOrderId = (createResp?.id as number | undefined) ?? 0;

    // PUT the rest. If this fails, the customer still gets through —
    // the payment is already captured and the caller can reconcile.
    const updatePayload: Record<string, unknown> = {
      payment_method: input.payment_method || "stripe",
      payment_method_title:
        input.payment_method === "stripe" ? "Stripe" : input.payment_method,
      set_paid: input.set_paid ?? false,
      status: input.status_override ?? "pending",
      billing: input.billing_address,
      shipping: input.shipping_address,
    };
    if (input.customer_note) updatePayload.customer_note = input.customer_note;
    if (input.transaction_id) {
      updatePayload.transaction_id = input.transaction_id;
    }
    if (stripePmId) {
      updatePayload.meta_data = [
        { key: "_stripe_payment_method_id", value: String(stripePmId) },
      ];
    }

    let order: Record<string, unknown> = createResp;
    try {
      order = await wc<Record<string, unknown>>(`/orders/${newOrderId}`, {
        method: "PUT",
        revalidate: false,
        body: JSON.stringify(updatePayload),
      } as never);
    } catch (err) {
      // Leave the created order in place — better a partial order
      // than a lost sale. Log so we can reconcile.
      console.warn(
        "[CheckoutService.submit] PUT /orders update failed after POST succeeded",
        {
          order_id: newOrderId,
          message: err instanceof Error ? err.message : String(err),
        },
      );
    }

    if (!env.WC_STORE_URL) {
      throw new WooError("WC_STORE_URL is not configured.", 500);
    }

    // Cart is now recorded on Woo's side — safe to clear locally.
    await CartService.clear();

    const orderId = (order?.id as number | undefined) ?? 0;
    const payUrl =
      (order?.payment_url as string | undefined) ??
      `${env.WC_STORE_URL.replace(/\/$/, "")}/checkout/order-pay/${orderId}/`;

    // Return in the WCCheckoutResponse shape the client already expects.
    return {
      order_id: orderId,
      status: "pending",
      order_key: (order?.order_key as string | undefined) ?? "",
      order_number: String(
        (order?.number as string | undefined) ?? orderId,
      ),
      customer_note: (order?.customer_note as string | undefined) ?? "",
      customer_id: (order?.customer_id as number | undefined) ?? 0,
      billing_address: input.billing_address,
      shipping_address: input.shipping_address,
      payment_method: input.payment_method,
      payment_result: {
        payment_status: "success",
        payment_details: [
          { key: "order_id", value: String(orderId) },
          { key: "pay_url", value: payUrl },
        ],
        redirect_url: "",
      },
    };
  },
};
