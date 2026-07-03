import "server-only";
import { env } from "@/env";

/**
 * Low-level WooCommerce fetcher. Server-only — never leak credentials.
 *
 * Two variants:
 *  - `wc(path, options)` — REST v3, admin API (products, categories, etc.)
 *    Auth via consumer key/secret query params (server-side over HTTPS).
 *  - `wcStore(path, options)` — Store API v1, customer-facing (cart, checkout).
 *    No auth needed; uses Cart-Token header for guest sessions.
 */

const REST_BASE = () =>
  env.WC_STORE_URL
    ? `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-json/${env.WC_API_VERSION}`
    : "";

const STORE_BASE = () =>
  env.WC_STORE_URL
    ? `${env.WC_STORE_URL.replace(/\/$/, "")}/wp-json/${env.WC_STORE_API_VERSION}`
    : "";

export interface WCFetchOptions extends Omit<RequestInit, "body"> {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  revalidate?: number | false;
  tags?: string[];
}

function buildQuery(
  params?: Record<string, string | number | boolean | undefined | null>,
) {
  if (!params) return "";
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    usp.set(key, String(value));
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}

async function request<T>(url: string, options: WCFetchOptions): Promise<T> {
  const { query, body, revalidate, tags, headers, ...rest } = options;
  const finalUrl = `${url}${buildQuery(query)}`;
  const res = await fetch(finalUrl, {
    ...rest,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    next:
      revalidate === false
        ? { revalidate: 0 }
        : { revalidate: revalidate ?? 60, tags },
  });

  if (!res.ok) {
    let detail = "";
    try {
      detail = await res.text();
    } catch {
      /* ignore */
    }
    throw new WooError(
      `WooCommerce request failed: ${res.status} ${res.statusText}`,
      res.status,
      detail,
    );
  }
  return (await res.json()) as T;
}

export async function wc<T>(path: string, options: WCFetchOptions = {}) {
  if (!env.WC_STORE_URL || !env.WC_CONSUMER_KEY || !env.WC_CONSUMER_SECRET) {
    throw new WooError(
      "WooCommerce credentials are not configured. Set WC_STORE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET or run with NEXT_PUBLIC_USE_MOCKS=true.",
      500,
    );
  }
  return request<T>(`${REST_BASE()}${path}`, {
    ...options,
    query: {
      ...(options.query ?? {}),
      consumer_key: env.WC_CONSUMER_KEY,
      consumer_secret: env.WC_CONSUMER_SECRET,
    },
  });
}

export async function wcStore<T>(path: string, options: WCFetchOptions = {}) {
  if (!env.WC_STORE_URL) {
    throw new WooError("WC_STORE_URL is not configured.", 500);
  }
  return request<T>(`${STORE_BASE()}${path}`, options);
}

export class WooError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string,
  ) {
    super(message);
    this.name = "WooError";
  }
}

export const shouldUseMocks = () => env.NEXT_PUBLIC_USE_MOCKS;
