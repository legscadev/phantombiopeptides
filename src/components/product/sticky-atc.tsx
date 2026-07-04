"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import type { WCProduct } from "@/types";

export function StickyAddToCart({ product }: { product: WCProduct }) {
  const { addItem, isLoading } = useCart();
  const [visible, setVisible] = React.useState(false);
  const outOfStock = product.stock_status === "outofstock";
  const isVariable = product.type === "variable";

  React.useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 720);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (isVariable) {
      // Send the customer back to the purchase panel so they can pick
      // a dose. Otherwise a raw add-to-cart on a variable product would
      // fail with "Missing attributes for variable product".
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    addItem(product.id, 1);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-0 right-0 z-30 px-4"
        >
          <div className="container-page">
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-background/95 p-3 shadow-[0_-16px_50px_-20px_rgba(15,15,25,0.35)] ring-1 ring-black/5 backdrop-blur-xl">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {product.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isVariable && "From "}
                  {formatPrice(product.price)}
                </p>
              </div>
              <Button
                size="lg"
                disabled={outOfStock || isLoading}
                onClick={handleClick}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : outOfStock ? (
                  "Out of stock"
                ) : isVariable ? (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    Choose options
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
