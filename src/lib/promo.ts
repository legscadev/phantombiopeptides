/**
 * Site-wide promo config. Update these values to change the promo bar
 * copy, countdown target, and CTA. Keeping this in code (not env) lets
 * marketing changes go through PR review and preserves history.
 */
export interface Promo {
  enabled: boolean;
  message: string;
  cta_label: string;
  cta_href: string;
  /** ISO string. When null, the countdown is hidden and only the message shows. */
  ends_at: string | null;
}

export const currentPromo: Promo = {
  enabled: true,
  message: "Independence Week — Buy 2, Get 1 FREE on eligible vials.",
  cta_label: "Shop now",
  cta_href: "/shop?on_sale=true",
  ends_at: "2026-07-11T23:59:59-04:00",
};
