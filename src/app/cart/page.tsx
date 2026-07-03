import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CartService } from "@/services/cart";
import { CartPageClient } from "./cart-client";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Cart",
  description: "Review your research order.",
  path: "/cart",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await CartService.get().catch(() => null);
  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        Your cart
      </h1>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card p-16 text-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/10 blur-xl" />
            <ShoppingBag className="relative h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium">Your cart is empty</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Add some compounds from the catalog to get started.
          </p>
          <Button asChild>
            <Link href="/shop">
              Browse the shop <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <CartPageClient initialCart={cart} />
      )}
    </div>
  );
}
