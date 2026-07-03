"use server";

import { revalidatePath } from "next/cache";
import { CheckoutService } from "@/services/checkout";
import type { WCAddress, WCCheckoutResponse } from "@/types";

export interface SubmitCheckoutInput {
  billing_address: WCAddress;
  shipping_address: WCAddress;
  customer_note?: string;
  /** Stripe PaymentMethod id from `stripe.createPaymentMethod`. */
  stripe_payment_method_id: string;
}

export interface SubmitCheckoutResult {
  ok: boolean;
  error?: string;
  order?: WCCheckoutResponse;
  /**
   * Populated when the Stripe payment requires 3-D Secure. The client should
   * hand this off to `stripe.handleNextAction({ clientSecret })`.
   */
  requires_action_client_secret?: string;
  /** Fallback redirect URL for gateways that route the browser to Stripe. */
  redirect_url?: string;
}

/**
 * Server action that submits the checkout to WooCommerce Store API.
 * The Woo Stripe plugin creates the PaymentIntent and confirms it. If SCA
 * is required, the response carries either a client_secret in
 * payment_details or a redirect_url.
 */
export async function submitCheckoutAction(
  input: SubmitCheckoutInput,
): Promise<SubmitCheckoutResult> {
  try {
    const order = await CheckoutService.submit({
      billing_address: input.billing_address,
      shipping_address: input.shipping_address,
      customer_note: input.customer_note ?? "",
      payment_method: "stripe",
      payment_data: [
        // Modern Woo Stripe plugin key
        { key: "wc-stripe-payment-method", value: input.stripe_payment_method_id },
        // Legacy compatibility shims — harmless if the plugin ignores them
        { key: "stripe_source", value: input.stripe_payment_method_id },
        { key: "wc-stripe-new-payment-method", value: false },
      ],
    });

    const status = order.payment_result?.payment_status;
    const details = order.payment_result?.payment_details ?? [];
    const findDetail = (k: string) =>
      details.find((d) => d.key === k)?.value;

    const clientSecret =
      (findDetail("payment_intent_secret") ??
        findDetail("client_secret") ??
        findDetail("stripe_client_secret")) as string | undefined;
    const redirect =
      order.payment_result?.redirect_url ||
      ((findDetail("redirect") ?? findDetail("verification_url")) as
        | string
        | undefined) ||
      undefined;

    if (status === "success") {
      revalidatePath("/cart");
      return { ok: true, order };
    }
    if (status === "pending" && (clientSecret || redirect)) {
      return {
        ok: true,
        order,
        requires_action_client_secret: clientSecret,
        redirect_url: redirect,
      };
    }
    if (status === "failure" || status === "error") {
      return {
        ok: false,
        order,
        error:
          (findDetail("errorMessage") as string) ??
          "Payment was declined. Please try a different card.",
      };
    }

    return { ok: true, order };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout failed unexpectedly.";
    return { ok: false, error: message };
  }
}
