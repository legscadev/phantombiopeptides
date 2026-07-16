// Client-side helpers for the TikTok pixel (`ttq`).
//
// Every helper is a safe no-op when the pixel script hasn't loaded
// (SSR, ad blockers, consent tools), so callers never need guards.
// TikTok hashes PII passed to `identify` (email/phone) in the browser
// before it is sent.

export const TIKTOK_PIXEL_ID = "D9CL3N3C77U5J670JMGG";

interface TtqContent {
  content_id: string;
  content_type: "product";
  content_name?: string;
  quantity?: number;
  price?: number;
}

interface TtqEventProps {
  contents?: TtqContent[];
  value?: number;
  currency?: string;
}

interface Ttq {
  page: () => void;
  track: (event: string, props?: TtqEventProps) => void;
  identify: (data: { email?: string; phone_number?: string }) => void;
}

declare global {
  interface Window {
    ttq?: Ttq;
  }
}

function toNumber(
  value: string | number | null | undefined,
): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : undefined;
}

export function ttqPage(): void {
  try {
    window.ttq?.page();
  } catch {
    // Never let analytics break the storefront.
  }
}

export function ttqIdentify(data: {
  email?: string;
  phone_number?: string;
}): void {
  try {
    window.ttq?.identify(data);
  } catch {
    // Never let analytics break the storefront.
  }
}

export function ttqTrack(event: string, props?: TtqEventProps): void {
  try {
    window.ttq?.track(event, props);
  } catch {
    // Never let analytics break the storefront.
  }
}

export interface TrackableItem {
  id: number | string;
  name: string;
  price?: string | number | null;
  quantity?: number;
}

function toContent(item: TrackableItem): TtqContent {
  return {
    content_id: String(item.id),
    content_type: "product",
    content_name: item.name,
    quantity: item.quantity ?? 1,
    price: toNumber(item.price),
  };
}

export function trackViewContent(item: TrackableItem, currency = "USD"): void {
  ttqTrack("ViewContent", {
    contents: [toContent(item)],
    value: toNumber(item.price),
    currency,
  });
}

export function trackAddToCart(item: TrackableItem, currency = "USD"): void {
  ttqTrack("AddToCart", {
    contents: [toContent(item)],
    value: toNumber(item.price),
    currency,
  });
}

export function trackInitiateCheckout(
  items: TrackableItem[],
  value: string | number | null | undefined,
  currency = "USD",
): void {
  ttqTrack("InitiateCheckout", {
    contents: items.map(toContent),
    value: toNumber(value),
    currency,
  });
}

export function trackCompletePayment(
  items: TrackableItem[],
  value: string | number | null | undefined,
  currency = "USD",
): void {
  ttqTrack("CompletePayment", {
    contents: items.map(toContent),
    value: toNumber(value),
    currency,
  });
}
