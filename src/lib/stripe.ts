import { loadStripe, type Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Singleton Stripe.js loader — Stripe recommends loading exactly once
 * per page. Uses the client-safe NEXT_PUBLIC_ key; the secret key lives
 * only on the WordPress side inside the Woo Stripe plugin.
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn(
        "[stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set — checkout will be disabled.",
      );
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
