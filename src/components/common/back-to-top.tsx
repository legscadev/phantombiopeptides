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
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
          }}
          className={cn(
            "fixed right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white md:right-6",
            "shadow-[0_16px_36px_-12px_hsl(var(--brand-500)/0.6)] ring-1 ring-white/15",
            "transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-12px_hsl(var(--brand-500)/0.7)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--brand-500))] focus-visible:ring-offset-2",
            onProductPage ? "bottom-24 md:bottom-24" : "bottom-6 md:bottom-8",
          )}
        >
          <ArrowUp className="h-5 w-5" strokeWidth={3} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
