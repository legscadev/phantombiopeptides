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
  message: "Free shipping on US orders over $250.",
  cta_label: "Shop peptides",
  cta_href: "/shop",
  ends_at: null,
};
