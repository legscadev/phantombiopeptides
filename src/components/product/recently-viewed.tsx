"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { WCProduct } from "@/types";

const KEY = "pl_recently_viewed";
const MAX = 8;

export function useRecordRecent(product?: Pick<
  WCProduct,
  "id" | "slug" | "name" | "price" | "images"
>) {
  React.useEffect(() => {
    if (!product) return;
    try {
      const raw = localStorage.getItem(KEY);
      const list: typeof product[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((p) => p.id !== product.id);
      filtered.unshift(product);
      localStorage.setItem(KEY, JSON.stringify(filtered.slice(0, MAX)));
    } catch {
      /* localStorage disabled */
    }
  }, [product]);
}

export function RecentlyViewed({ excludeId }: { excludeId?: number }) {
  const [items, setItems] = React.useState<
    Array<Pick<WCProduct, "id" | "slug" | "name" | "price" | "images">>
  >([]);

  React.useEffect(() => {
    let cancelled = false;
    try {
      const raw = localStorage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(
        (p: { id: number }) => p.id !== excludeId,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!cancelled) setItems(filtered);
    } catch {
      /* empty */
    }
    return () => {
      cancelled = true;
    };
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container-page">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">
          Recently viewed
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {items.slice(0, 6).map((p) => (
            <li key={p.id}>
              <Link
                href={`/product/${p.slug}`}
                className="group block rounded-xl border border-border bg-card p-2 transition-colors hover:border-border-strong"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg bg-background">
                  {p.images[0] && (
                    <Image
                      src={p.images[0].src}
                      alt={p.images[0].alt || p.name}
                      fill
                      sizes="140px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-2 truncate text-xs font-medium">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {formatPrice(p.price)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function RecordRecent({
  product,
}: {
  product: Pick<WCProduct, "id" | "slug" | "name" | "price" | "images">;
}) {
  useRecordRecent(product);
  return null;
}
