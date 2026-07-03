import "server-only";
import { cookies } from "next/headers";
import { env } from "@/env";
import { shouldUseMocks, WooError } from "./woocommerce";
import { wcCartSchema } from "@/schemas/woocommerce";
import { mockProducts } from "@/mocks/products";
import type { WCCart } from "@/types";

/**
 * Store API returns prices in minor units (e.g. "4599" for $45.99) whereas
 * our UI and mocks work in decimal strings. Normalize once at the service
 * boundary so downstream code stays consistent regardless of data source.
 */
function normalizeCartPrices(cart: WCCart): WCCart {
  const unit = cart.totals.currency_minor_unit ?? 2;
  const div = 10 ** unit;
  const toDecimal = (v?: string) => {
    if (v === undefined || v === null || v === "") return v ?? "0";
    const n = Number(v);
    if (!Number.isFinite(n)) return v;
    // If value already looks like a decimal (contains "."), leave it alone.
    if (String(v).includes(".")) return v;
    return (n / div).toFixed(unit);
  };
  return {
    ...cart,
    items: cart.items.map((item) => ({
      ...item,
      prices: {
        ...item.prices,
        price: toDecimal(item.prices.price),
        regular_price: toDecimal(item.prices.regular_price),
        sale_price: toDecimal(item.prices.sale_price),
      },
      totals: {
        line_subtotal: toDecimal(item.totals.line_subtotal),
        line_total: toDecimal(item.totals.line_total),
      },
    })),
    totals: {
      ...cart.totals,
      total_items: toDecimal(cart.totals.total_items),
      total_discount: toDecimal(cart.totals.total_discount),
      total_shipping: toDecimal(cart.totals.total_shipping),
      total_tax: toDecimal(cart.totals.total_tax),
      total_price: toDecimal(cart.totals.total_price),
    },
  };
}

/**
 * Cart is powered by the WooCommerce Store API which returns a
 * `Cart-Token` header that identifies the guest session. We persist
 * it to an httpOnly cookie so subsequent requests stay bound.
 *
 * In mocks mode we still call the same interface but persist a
 * lightweight cart in a cookie so the UI is fully functional locally.
 */

const CART_COOKIE = "pl_cart_token";
const MOCK_CART_COOKIE = "pl_mock_cart";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

interface MockCartItem {
  id: number;
  quantity: number;
}

async function readMockCart(): Promise<WCCart> {
  const store = await cookies();
  const raw = store.get(MOCK_CART_COOKIE)?.value;
  const items: MockCartItem[] = raw ? JSON.parse(raw) : [];

  const cartItems = items
    .map((it) => {
      const product = mockProducts.find((p) => p.id === it.id);
      if (!product) return null;
      const lineSubtotal = parseFloat(product.price) * it.quantity;
      return {
        key: `k${it.id}`,
        id: product.id,
        quantity: it.quantity,
        name: product.name,
        short_description: product.short_description,
        permalink: product.permalink,
        images: product.images.slice(0, 1),
        prices: {
          currency_code: "USD",
          currency_symbol: "$",
          currency_minor_unit: 2,
          price: product.price,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
        },
        totals: {
          line_subtotal: lineSubtotal.toFixed(2),
          line_total: lineSubtotal.toFixed(2),
        },
      };
    })
    .filter(Boolean) as WCCart["items"];

  const subtotal = cartItems.reduce(
    (s, it) => s + parseFloat(it.totals.line_subtotal),
    0,
  );
  return {
    items: cartItems,
    items_count: cartItems.reduce((s, it) => s + it.quantity, 0),
    needs_shipping: cartItems.length > 0,
    coupons: [],
    totals: {
      currency_code: "USD",
      currency_symbol: "$",
      currency_minor_unit: 2,
      total_items: subtotal.toFixed(2),
      total_discount: "0.00",
      total_shipping: "0.00",
      total_tax: "0.00",
      total_price: subtotal.toFixed(2),
    },
  };
}

async function writeMockCart(items: MockCartItem[]) {
  const store = await cookies();
  store.set(MOCK_CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

async function readMockItems(): Promise<MockCartItem[]> {
  const store = await cookies();
  const raw = store.get(MOCK_CART_COOKIE)?.value;
  return raw ? JSON.parse(raw) : [];
}

/**
 * Store API is unauthenticated but session-bound: the server issues a
 * `Cart-Token` on the first response, and each subsequent request must
 * echo it in the `Cart-Token` request header. We persist the current
 * token in an httpOnly cookie so the guest session survives requests.
 */
async function storeApiCall<T>(
  path: string,
  init: RequestInit & { revalidate?: false } = {},
): Promise<T> {
  if (!env.WC_STORE_URL) {
    throw new WooError("WC_STORE_URL is not configured.", 500);
  }
  const store = await cookies();
  const token = store.get(CART_COOKIE)?.value;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) headers["Cart-Token"] = token;

  const url = `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-json/${env.WC_STORE_API_VERSION}${path}`;
  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const newToken = res.headers.get("cart-token") ?? res.headers.get("Cart-Token");
  if (newToken && newToken !== token) {
    store.set(CART_COOKIE, newToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });
  }

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new WooError(
      `Store API ${path} failed: ${res.status} ${res.statusText}`,
      res.status,
      detail,
    );
  }
  return (await res.json()) as T;
}

export const CartService = {
  async get(): Promise<WCCart> {
    if (shouldUseMocks()) return readMockCart();
    const data = await storeApiCall<unknown>("/cart");
    return normalizeCartPrices(wcCartSchema.parse(data));
  },

  async addItem(productId: number, quantity = 1): Promise<WCCart> {
    if (shouldUseMocks()) {
      const items = await readMockItems();
      const existing = items.find((i) => i.id === productId);
      if (existing) existing.quantity += quantity;
      else items.push({ id: productId, quantity });
      await writeMockCart(items);
      return readMockCart();
    }
    const data = await storeApiCall<unknown>("/cart/add-item", {
      method: "POST",
      body: JSON.stringify({ id: productId, quantity }),
    });
    return normalizeCartPrices(wcCartSchema.parse(data));
  },

  async updateItem(key: string, quantity: number): Promise<WCCart> {
    if (shouldUseMocks()) {
      const items = await readMockItems();
      const id = parseInt(key.replace("k", ""), 10);
      const item = items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          await writeMockCart(items.filter((i) => i.id !== id));
        } else {
          item.quantity = quantity;
          await writeMockCart(items);
        }
      }
      return readMockCart();
    }
    const data = await storeApiCall<unknown>("/cart/update-item", {
      method: "POST",
      body: JSON.stringify({ key, quantity }),
    });
    return normalizeCartPrices(wcCartSchema.parse(data));
  },

  async removeItem(key: string): Promise<WCCart> {
    if (shouldUseMocks()) {
      const items = await readMockItems();
      const id = parseInt(key.replace("k", ""), 10);
      await writeMockCart(items.filter((i) => i.id !== id));
      return readMockCart();
    }
    const data = await storeApiCall<unknown>("/cart/remove-item", {
      method: "POST",
      body: JSON.stringify({ key }),
    });
    return normalizeCartPrices(wcCartSchema.parse(data));
  },

  async applyCoupon(code: string): Promise<WCCart> {
    if (shouldUseMocks()) return readMockCart();
    const data = await storeApiCall<unknown>("/cart/apply-coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    return normalizeCartPrices(wcCartSchema.parse(data));
  },

  async removeCoupon(code: string): Promise<WCCart> {
    if (shouldUseMocks()) return readMockCart();
    const data = await storeApiCall<unknown>("/cart/remove-coupon", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
    return normalizeCartPrices(wcCartSchema.parse(data));
  },
};
