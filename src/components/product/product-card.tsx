"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";
import type { WCProduct } from "@/types";

interface ProductCardProps {
  product: WCProduct;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const discount = product.on_sale
    ? calculateDiscount(product.regular_price, product.sale_price || product.price)
    : 0;
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const outOfStock = product.stock_status === "outofstock";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border-strong",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-background"
      >
        {primary && (
          <>
            <Image
              src={primary.src}
              alt={primary.alt || product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {secondary && secondary !== primary && (
              <Image
                src={secondary.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-60" />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge variant="sale">-{discount}%</Badge>
          )}
          {product.tags.some((t) => t.slug === "new") && (
            <Badge variant="accent">New</Badge>
          )}
          {outOfStock && <Badge variant="outline">Out of stock</Badge>}
        </div>

        {product.rating_count > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[11px] backdrop-blur">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-foreground/90">{product.average_rating}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.categories[0] && (
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {product.categories[0].name}
          </p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="text-base font-medium leading-snug hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.short_description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.on_sale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.regular_price)}
              </span>
            )}
          </div>
          <button
            type="button"
            disabled={outOfStock || isLoading}
            onClick={() => addItem(product.id, 1)}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-background-elevated transition-all",
              "hover:border-primary/60 hover:bg-primary hover:text-primary-foreground",
              "disabled:opacity-40 disabled:hover:bg-background-elevated disabled:hover:text-foreground",
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[0_20px_60px_-20px_hsl(258_90%_50%/0.5)] transition-opacity duration-500 group-hover:opacity-100" />
    </motion.article>
  );
}
