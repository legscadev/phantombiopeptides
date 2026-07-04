import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartService } from "@/services/cart";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Button } from "@/components/ui/button";
import { CheckoutRedirect } from "./checkout-redirect";
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
  const items = await CartService.getLineItems();

  if (items.length === 0) {
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

  const wpBase = env.WC_STORE_URL ?? "";

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

      <CheckoutRedirect
        items={items.map((it) => ({
          productId: it.id,
          quantity: it.quantity,
        }))}
        wpBase={wpBase}
      />
    </div>
  );
}
