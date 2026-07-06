"use client";

import * as React from "react";
import { Loader2, Tag, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";

export function CouponPanel() {
  const { cart, applyCoupon, removeCoupon, isLoading } = useCart();
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");

  const applied = cart?.coupons ?? [];
  const totalDiscount = parseFloat(cart?.totals.total_discount ?? "0");
  const currency = cart?.totals.currency_code ?? "USD";

  // Auto-expand if the user already has a coupon applied.
  React.useEffect(() => {
    if (applied.length > 0) setOpen(true);
  }, [applied.length]);

  async function onApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || isLoading) return;
    await applyCoupon(code);
    setCode("");
  }

  return (
    <fieldset className="rounded-2xl border border-border bg-card p-6">
      <legend className="flex items-center gap-2 px-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Tag className="h-3 w-3" />
        Coupon
      </legend>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm font-medium text-[color:hsl(var(--brand-500))] transition-colors hover:text-[color:hsl(var(--brand-400))]"
        >
          Have a coupon code?
        </button>
      ) : (
        <div className="space-y-4">
          {applied.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2">
              {applied.map((c) => (
                <li
                  key={c.code}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:hsl(var(--brand-200))] px-3 py-1.5 text-xs font-semibold text-[color:hsl(var(--brand-500))]"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--brand-100) / 0.9) 0%, hsl(var(--brand-50) / 0.9) 100%)",
                  }}
                >
                  <span className="uppercase tracking-wider">{c.code}</span>
                  <button
                    type="button"
                    onClick={() => removeCoupon(c.code)}
                    disabled={isLoading}
                    className="rounded-full p-0.5 text-[color:hsl(var(--brand-500))] transition-colors hover:bg-[color:hsl(var(--brand-500))] hover:text-white disabled:opacity-40"
                    aria-label={`Remove coupon ${c.code}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </li>
              ))}
              {totalDiscount > 0 && (
                <span className="text-xs text-success">
                  −{formatPrice(totalDiscount.toFixed(2), currency)} applied
                </span>
              )}
            </ul>
          )}

          <form onSubmit={onApply} className="flex gap-2">
            <Input
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!code.trim() || isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </form>
        </div>
      )}
    </fieldset>
  );
}
