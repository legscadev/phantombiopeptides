import "server-only";
import { cookies } from "next/headers";
import { ProductsService } from "./products";
import type { WCCart, WCProduct, WCVariation } from "@/types";

/**
 * Cart is stored on our side (httpOnly cookie), not in WooCommerce.
 *
 * Background: WooCommerce Store API's guest cart persistence relies on
 * PHP sessions, which WordPress.com's multi-tenant hosting does not
 * reliably maintain between requests — items were being POSTed
 * successfully but disappearing on the very next GET /cart. Rather
 * than fight the hosting, we hold the cart line items ourselves,
 * hydrate them with live product data from the Woo REST API on read,
 * and submit the full basket as a Woo order at checkout time via the
 * authenticated REST endpoint (which does not depend on sessions).
 *
 * Cookie shape (JSON-encoded array of):
 *   { id: number; quantity: number; variation?: [{attribute, value}] }
 */

const CART_COOKIE = "pl_cart_items";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

interface CartLineItem {
  id: number;
  quantity: number;
  variation?: Array<{ attribute: string; value: string }>;
  /** WooCommerce variation id for variable products. */
  variation_id?: number;
}

function variationHash(v?: CartLineItem["variation"]): string {
  if (!v || v.length === 0) return "";
  const norm = v
    .map((x) => `${x.attribute.toLowerCase()}=${x.value.toLowerCase()}`)
    .sort()
    .join("|");
  // Simple stable hash — good enough for a cart key.
  let h = 0;
  for (let i = 0; i < norm.length; i++) h = (h * 31 + norm.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function itemKey(item: CartLineItem): string {
  // Prefer the concrete WC variation id when we have it (guaranteed
  // unique per line), fall back to hashing the raw attributes.
  if (item.variation_id) return `k${item.id}-v${item.variation_id}`;
  const suffix = variationHash(item.variation);
  return suffix ? `k${item.id}-${suffix}` : `k${item.id}`;
}

function sameLine(a: CartLineItem, b: CartLineItem): boolean {
  return itemKey(a) === itemKey(b);
}

async function readCartItems(): Promise<CartLineItem[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (x): x is CartLineItem =>
          typeof x?.id === "number" && typeof x?.quantity === "number",
      )
      .map((x) => ({
        id: x.id,
        quantity: x.quantity,
        variation: x.variation,
        variation_id:
          typeof x.variation_id === "number" ? x.variation_id : undefined,
      }));
  } catch {
    return [];
  }
}

async function writeCartItems(items: CartLineItem[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}

function emptyCart(): WCCart {
  return {
    items: [],
    items_count: 0,
    needs_shipping: false,
    coupons: [],
    totals: {
      currency_code: "USD",
      currency_symbol: "$",
      currency_minor_unit: 2,
      total_items: "0.00",
      total_discount: "0.00",
      total_shipping: "0.00",
      total_tax: "0.00",
      total_price: "0.00",
    },
  };
}

function buildLineItem(
  item: CartLineItem,
  product: WCProduct,
  variation: WCVariation | null,
): WCCart["items"][number] {
  // Variation price / image / stock take precedence over the parent
  // product's values when the customer picked a specific variation.
  const unitPrice = parseFloat(variation?.price || product.price) || 0;
  const regularPrice = variation?.regular_price || product.regular_price;
  const salePrice = variation?.sale_price || product.sale_price;
  const lineSubtotal = unitPrice * item.quantity;
  const image = variation?.image ?? product.images[0];
  const doseSuffix = item.variation
    ?.map((v) => v.value)
    .join(" / ");
  const displayName = doseSuffix
    ? `${product.name} — ${doseSuffix}`
    : product.name;
  return {
    key: itemKey(item),
    id: product.id,
    quantity: item.quantity,
    name: displayName,
    short_description: product.short_description,
    permalink: product.permalink,
    images: image ? [image] : [],
    prices: {
      currency_code: "USD",
      currency_symbol: "$",
      currency_minor_unit: 2,
      price: unitPrice.toFixed(2),
      regular_price: regularPrice,
      sale_price: salePrice,
    },
    totals: {
      line_subtotal: lineSubtotal.toFixed(2),
      line_total: lineSubtotal.toFixed(2),
    },
  };
}

async function hydrateCart(items: CartLineItem[]): Promise<WCCart> {
  if (items.length === 0) return emptyCart();
  const productsPromise = Promise.all(
    items.map((it) => ProductsService.getById(it.id).catch(() => null)),
  );
  // For every line that has a variation_id, fetch the full variations
  // list for the parent product once and pick the matching variant.
  const uniqueVariableIds = Array.from(
    new Set(
      items
        .filter((it) => typeof it.variation_id === "number")
        .map((it) => it.id),
    ),
  );
  const variationListsPromise = Promise.all(
    uniqueVariableIds.map((pid) =>
      ProductsService.getVariations(pid).catch(() => [] as WCVariation[]),
    ),
  );
  const [products, variationLists] = await Promise.all([
    productsPromise,
    variationListsPromise,
  ]);
  const variationsByProductId = new Map<number, WCVariation[]>();
  uniqueVariableIds.forEach((pid, i) =>
    variationsByProductId.set(pid, variationLists[i] ?? []),
  );

  const cartItems: WCCart["items"] = [];
  for (let i = 0; i < items.length; i++) {
    const p = products[i];
    if (!p) continue;
    const line = items[i];
    let variation: WCVariation | null = null;
    if (line.variation_id) {
      const list = variationsByProductId.get(line.id) ?? [];
      variation =
        list.find((v) => v.id === line.variation_id) ?? null;
    }
    cartItems.push(buildLineItem(line, p, variation));
  }
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

export const CartService = {
  async get(): Promise<WCCart> {
    return hydrateCart(await readCartItems());
  },

  async addItem(
    productId: number,
    quantity = 1,
    variation?: Array<{ attribute: string; value: string }>,
    variationId?: number,
  ): Promise<WCCart> {
    const items = await readCartItems();
    const newLine: CartLineItem = {
      id: productId,
      quantity,
      variation,
      variation_id: variationId,
    };
    const existing = items.find((it) => sameLine(it, newLine));
    if (existing) existing.quantity += quantity;
    else items.push(newLine);
    await writeCartItems(items);
    return hydrateCart(items);
  },

  async updateItem(key: string, quantity: number): Promise<WCCart> {
    let items = await readCartItems();
    if (quantity <= 0) {
      items = items.filter((it) => itemKey(it) !== key);
    } else {
      const item = items.find((it) => itemKey(it) === key);
      if (item) item.quantity = quantity;
    }
    await writeCartItems(items);
    return hydrateCart(items);
  },

  async removeItem(key: string): Promise<WCCart> {
    const items = (await readCartItems()).filter(
      (it) => itemKey(it) !== key,
    );
    await writeCartItems(items);
    return hydrateCart(items);
  },

  // Coupons aren't supported yet — we'd need to run Woo's discount rules
  // ourselves or hand the cart off to Woo at checkout, then re-read.
  async applyCoupon(_code: string): Promise<WCCart> {
    return this.get();
  },

  async removeCoupon(_code: string): Promise<WCCart> {
    return this.get();
  },

  /**
   * Raw line items — used at checkout to hand off to Woo via the
   * authenticated REST /orders endpoint.
   */
  async getLineItems(): Promise<CartLineItem[]> {
    return readCartItems();
  },

  async clear(): Promise<void> {
    await writeCartItems([]);
  },
};
