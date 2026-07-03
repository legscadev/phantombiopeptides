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
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-[0_20px_50px_-15px_hsl(264_100%_40%/0.4)]",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-background-muted"
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

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {product.tags.some((t) => t.slug === "new") && (
            <Badge variant="accent">New</Badge>
          )}
          {outOfStock && <Badge variant="outline">Sold out</Badge>}
        </div>

        {product.rating_count > 0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-[11px] backdrop-blur">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="text-foreground/90">{product.average_rating}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.categories[0] && (
          <p className="text-[10px] uppercase tracking-[0.14em] text-primary">
            {product.categories[0].name}
          </p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="text-base font-bold leading-snug hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.short_description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-foreground">
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
            style={{
              background:
                "linear-gradient(135deg, hsl(264 100% 40%) 0%, hsl(280 100% 34%) 100%)",
            }}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-semibold uppercase tracking-wider text-white transition-all",
              "hover:brightness-110",
              "disabled:opacity-40",
            )}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </motion.article>
  );
}
