"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Item {
  productId: number;
  quantity: number;
}

/**
 * Bridge component. Populates the WooCommerce cart on wpcomstaging.com
 * by loading each item as a `?add-to-cart` URL in a hidden iframe (which
 * sets the WP session cookie on their domain in the customer's browser)
 * and then top-level navigates to the WP /checkout page where the full
 * Stripe / Apple Pay / Google Pay / Link UI is available.
 *
 * Falls back to a manual "Continue" button after a short deadline so
 * customers are never stuck if a network request stalls.
 */
export function CheckoutRedirect({
  items,
  wpBase,
}: {
  items: Item[];
  wpBase: string;
}) {
  const [ready, setReady] = React.useState<Set<number>>(new Set());
  const [showFallback, setShowFallback] = React.useState(false);
  const checkoutUrl = `${wpBase.replace(/\/$/, "")}/checkout/`;

  React.useEffect(() => {
    // Give the whole flow at most ~10s before we surface a manual button.
    const t = setTimeout(() => setShowFallback(true), 10_000);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (items.length === 0) return;
    if (ready.size >= items.length) {
      // All items acknowledged — send the customer to WP checkout.
      window.location.href = checkoutUrl;
    }
  }, [ready, items.length, checkoutUrl]);

  const onFrameLoad = (i: number) => {
    setReady((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-8 rounded-3xl border border-border bg-card p-10 text-center md:p-14">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
      <p className="mt-6 text-xs uppercase tracking-[0.24em] text-primary">
        Secure checkout
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Preparing your order…
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We&apos;re handing you off to our secure payment provider. This takes
        a couple of seconds.
      </p>

      {showFallback && (
        <div className="mt-6">
          <Button asChild size="lg">
            <a href={checkoutUrl}>
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
      )}

      {/* Hidden iframes populate the WP guest session with each cart line. */}
      <div className="sr-only" aria-hidden>
        {items.map((it, i) => (
          <iframe
            key={`${it.productId}-${i}`}
            title=""
            src={`${wpBase.replace(/\/$/, "")}/?add-to-cart=${it.productId}&quantity=${it.quantity}`}
            onLoad={() => onFrameLoad(i)}
          />
        ))}
      </div>
    </div>
  );
}
