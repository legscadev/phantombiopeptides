"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Star, ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";
import type { WCProduct } from "@/types";

interface ProductCardProps {
  product: WCProduct;
  priority?: boolean;
  className?: string;
}

/**
 * Glassmorphism product card — light glass info panel over a brand-tinted
 * media plinth. Hover: gentle lift, brighter halo, image cross-fades to
 * the secondary shot.
 */
export function ProductCard({ product, priority, className }: ProductCardProps) {
  const { addItem, isLoading } = useCart();
  const discount = product.on_sale
    ? calculateDiscount(product.regular_price, product.sale_price || product.price)
    : 0;
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const outOfStock = product.stock_status === "outofstock";
  const isVariable = product.type === "variable";
  const priceLabel = isVariable
    ? `From ${formatPrice(product.price)}`
    : formatPrice(product.price);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-white/80 backdrop-blur-md",
        "ring-1 ring-black/5",
        "shadow-[0_10px_30px_-15px_rgba(9,4,24,0.15)]",
        "transition-all duration-500",
        "hover:ring-[color:hsl(var(--brand-500))]/25 hover:shadow-[0_35px_60px_-25px_hsl(var(--brand-500)/0.35)]",
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 18%, #4900AD 0%, #060606 78%)",
        }}
      >
        {/* Ambient halo behind product */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(45% 45% at 50% 40%, rgba(168,121,255,0.35) 0%, transparent 65%)",
          }}
        />
        {primary && (
          <>
            <Image
              src={primary.src}
              alt={primary.alt || product.name}
              fill
              priority={priority}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            />
            {secondary && secondary !== primary && (
              <Image
                src={secondary.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </>
        )}

        {/* Left column of chips — status / new */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.tags.some((t) => t.slug === "new") && (
            <Badge variant="accent">New</Badge>
          )}
          {outOfStock && (
            <span className="glass rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground">
              Sold out
            </span>
          )}
        </div>

        {/* Right column — sale + rating */}
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {discount > 0 && (
            <span className="chip-brand rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest">
              -{discount}%
            </span>
          )}
          {product.rating_count > 0 && (
            <div className="glass flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-foreground">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span>{product.average_rating}</span>
            </div>
          )}
        </div>

        {/* Wishlist heart — bottom-right of media */}
        <button
          type="button"
          aria-label={`Save ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            /* wishlist placeholder — hook up later */
          }}
          className={cn(
            "glass absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/70 transition-all",
            "opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0",
            "hover:text-[color:hsl(var(--brand-500))]",
          )}
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        {product.categories[0] && (
          <p className="text-[10px] uppercase tracking-[0.16em] text-[color:hsl(var(--brand-500))]">
            {product.categories[0].name}
          </p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="font-display text-lg font-bold leading-snug tracking-tight transition-colors hover:text-[color:hsl(var(--brand-500))]"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.short_description}
        </p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="flex flex-col">
            {isVariable && (
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                From
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold text-foreground">
                {isVariable ? formatPrice(product.price) : priceLabel}
              </span>
              {product.on_sale && !isVariable && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.regular_price)}
                </span>
              )}
            </div>
          </div>
          {isVariable ? (
            <Link
              href={`/product/${product.slug}`}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold uppercase tracking-wider text-white transition-all",
                "bg-[color:hsl(var(--brand-500))] hover:bg-[color:hsl(var(--brand-400))]",
                "shadow-[0_10px_24px_-10px_hsl(var(--brand-500)/0.55)]",
              )}
              aria-label={`Choose options for ${product.name}`}
            >
              Options
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              disabled={outOfStock || isLoading}
              onClick={() => addItem(product.id, 1)}
              className={cn(
                "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold uppercase tracking-wider text-white transition-all",
                "bg-[color:hsl(var(--brand-500))] hover:bg-[color:hsl(var(--brand-400))]",
                "shadow-[0_10px_24px_-10px_hsl(var(--brand-500)/0.55)]",
                "disabled:opacity-40",
              )}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
