"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddToCart } from "./add-to-cart";
import { formatPrice } from "@/lib/utils";
import type { WCProduct } from "@/types";

export function StickyAddToCart({ product }: { product: WCProduct }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 720);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <div className="glass-strong flex items-center gap-4 rounded-2xl p-3 shadow-2xl">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="w-64 max-w-full">
                <AddToCart product={product} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
