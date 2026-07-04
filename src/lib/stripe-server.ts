import "server-only";
import Stripe from "stripe";
import { env } from "@/env";

/**
 * Server-side Stripe SDK instance. Never import this from client
 * components — the secret key must not leak to the browser bundle.
 */
export const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY)
  : null;

export function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Set STRIPE_SECRET_KEY in the environment.",
    );
  }
  return stripe;
}
