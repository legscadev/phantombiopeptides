"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // StickyAddToCart on /product/[slug] sits at bottom-4 full-width,
  // so lift the button above that band to avoid overlap.
  const onProductPage = pathname?.startsWith("/product/") ?? false;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Back to top"
          className={cn(
            "fixed right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full md:right-6",
            "border border-white/60 bg-white/85 text-foreground backdrop-blur",
            "shadow-[0_16px_36px_-14px_rgba(9,4,24,0.35)] ring-1 ring-black/5",
            "transition-all hover:border-[color:hsl(var(--brand-500))]/40 hover:text-[color:hsl(var(--brand-500))]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2",
            onProductPage ? "bottom-24 md:bottom-24" : "bottom-6 md:bottom-8",
          )}
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
