"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const KEY = "pl_wishlist";

interface Item {
  id: number;
  slug: string;
  name: string;
}

function read(): Item[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function write(items: Item[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("wishlist:change"));
}

export function WishlistClient() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(read());
    setReady(true);
    const onChange = () => setItems(read());
    window.addEventListener("wishlist:change", onChange);
    return () => window.removeEventListener("wishlist:change", onChange);
  }, []);

  function remove(id: number) {
    write(read().filter((i) => i.id !== id));
    toast("Removed from wishlist");
  }
  function clear() {
    write([]);
    toast("Wishlist cleared");
  }

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card p-16 text-center">
        <Heart className="h-6 w-6 text-muted-foreground" />
        <p className="text-lg font-medium">Nothing saved yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tap the heart on any product to save it for later. Your wishlist is
          stored on this device.
        </p>
        <Button asChild>
          <Link href="/shop">Browse the shop</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {items.length} saved compound{items.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-muted-foreground hover:text-destructive"
        >
          Clear all
        </button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <Link
              href={`/product/${item.slug}`}
              className="text-sm font-medium hover:text-primary"
            >
              {item.name}
            </Link>
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
