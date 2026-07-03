"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const KEY = "pl_wishlist";

interface WishlistItem {
  id: number;
  slug: string;
  name: string;
}

function readWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("wishlist:change"));
  } catch {
    /* localStorage disabled */
  }
}

interface Props {
  product: WishlistItem;
  className?: string;
}

export function WishlistButton({ product, className }: Props) {
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(readWishlist().some((p) => p.id === product.id));
    const onChange = () => setSaved(readWishlist().some((p) => p.id === product.id));
    window.addEventListener("wishlist:change", onChange);
    return () => window.removeEventListener("wishlist:change", onChange);
  }, [product.id]);

  function toggle() {
    const list = readWishlist();
    const exists = list.some((p) => p.id === product.id);
    if (exists) {
      writeWishlist(list.filter((p) => p.id !== product.id));
      toast("Removed from wishlist");
    } else {
      writeWishlist([product, ...list]);
      toast.success("Saved to wishlist");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all",
        saved
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background-elevated text-muted-foreground hover:border-primary/40 hover:text-primary",
        className,
      )}
    >
      <Heart
        className={cn("h-4 w-4", saved && "fill-primary")}
        strokeWidth={2}
      />
    </button>
  );
}
