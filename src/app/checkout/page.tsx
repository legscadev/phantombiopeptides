import Link from "next/link";
import { ShoppingBag, KeyRound } from "lucide-react";
import { CartService } from "@/services/cart";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { buildMetadata } from "@/lib/seo";
import { env } from "@/env";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your research order securely.",
  path: "/checkout",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const cart = await CartService.get().catch(() => null);
  const hasStripe = Boolean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-page py-16">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-16 text-center">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          <p className="text-lg font-medium">Nothing to check out yet</p>
          <Button asChild>
            <Link href="/shop">Continue browsing</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        Checkout
      </h1>

      {!hasStripe ? (
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/5 p-5 text-sm">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <div>
            <p className="font-medium text-foreground">
              Stripe publishable key missing
            </p>
            <p className="mt-1 text-muted-foreground">
              Set{" "}
              <code className="font-mono">
                NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
              </code>{" "}
              in Vercel (Project → Settings → Environment Variables) to
              enable the payment form. It starts with{" "}
              <code className="font-mono">pk_live_</code> or{" "}
              <code className="font-mono">pk_test_</code>. The matching{" "}
              <code className="font-mono">STRIPE_SECRET_KEY</code> is also
              required for the server side of the flow.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <CheckoutForm cart={cart} />
        </div>
      )}
    </div>
  );
}
