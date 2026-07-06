import "server-only";
import { wc } from "./woocommerce";
import { wcCouponSchema } from "@/schemas/woocommerce";
import type { WCCoupon } from "@/types";

const CACHE_REVALIDATE = 60; // 1 min — small window so admin edits show up.

export const CouponsService = {
  /**
   * Look up a coupon by exact code. Returns null if Woo doesn't
   * recognise the code — treat that as "invalid coupon".
   */
  async getByCode(code: string): Promise<WCCoupon | null> {
    const trimmed = code.trim();
    if (!trimmed) return null;
    try {
      const results = await wc<unknown[]>("/coupons", {
        query: { code: trimmed, per_page: 1 },
        revalidate: CACHE_REVALIDATE,
        tags: [`coupon:${trimmed.toLowerCase()}`],
      });
      if (!Array.isArray(results) || results.length === 0) return null;
      const parsed = wcCouponSchema.safeParse(results[0]);
      return parsed.success ? parsed.data : null;
    } catch {
      return null;
    }
  },
};
