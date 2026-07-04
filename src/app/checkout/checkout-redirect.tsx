"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Item {
  productId: number;
  quantity: number;
}

/**
 * Hand the customer off to the WordPress checkout.
 *
 * WooCommerce's session cookie is set as first-party on
 * `kickbackai-pkjdo.wpcomstaging.com` — it can only be established
 * from a top-level navigation to that domain, not from a cross-origin
 * iframe (browsers refuse to persist third-party cookies). So we do
 * exactly that: top.location.href to `<wp>/?add-to-cart=<id>&quantity=<n>`,
 * WP adds the item and redirects to its own /cart page, where the
 * customer can click "Proceed to Checkout" for the full Stripe UI.
 *
 * Multi-item note: this pattern only carries ONE cart line across.
 * The full multi-item handoff needs a small WP-side snippet that
 * reads all lines from a URL param; until that's in place, the UI
 * surfaces a warning and takes the customer through with the first
 * line only.
 */
export function CheckoutRedirect({
  items,
  wpBase,
}: {
  items: Item[];
  wpBase: string;
}) {
  const primary = items[0];
  // Target /checkout/ directly with the add-to-cart param — WooCommerce
  // processes the query on any page load, so this lands the customer
  // on the payment step in a single top-level navigation.
  const target = primary
    ? `${wpBase.replace(/\/$/, "")}/checkout/?add-to-cart=${primary.productId}&quantity=${primary.quantity}`
    : `${wpBase.replace(/\/$/, "")}/checkout/`;

  React.useEffect(() => {
    if (!primary) return;
    // Give the UI one frame to paint before we navigate away.
    const t = window.setTimeout(() => {
      window.location.href = target;
    }, 350);
    return () => window.clearTimeout(t);
  }, [primary, target]);

  return (
    <div className="mt-8 space-y-5">
      <div className="rounded-3xl border border-border bg-card p-10 text-center md:p-14">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        <p className="mt-6 text-xs uppercase tracking-[0.24em] text-primary">
          Secure checkout
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Handing you off to secure payment…
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You&apos;re about to enter our payment provider hosted by
          WooCommerce + Stripe. Cards, Apple Pay, Google Pay, and Link are
          supported.
        </p>

        <div className="mt-6">
          <Button asChild size="lg">
            <a href={target}>
              Continue to checkout <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Not redirecting?{" "}
            <Link href="/cart" className="underline">
              Return to cart
            </Link>
          </p>
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/5 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="font-medium text-foreground">
              Multi-item carts: only the first item transfers automatically.
            </p>
            <p className="mt-1 text-muted-foreground">
              Add the remaining items on the checkout page. We&apos;re
              working on a one-click transfer for the whole basket.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
