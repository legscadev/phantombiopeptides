import type { WCCategory } from "@/types";

/**
 * Slugs to pin to the top of any category listing (in this order).
 * Anything not on the list follows in its original Woo order.
 */
export const PRIORITY_CATEGORY_SLUGS = [
  "metabolic",
  "recovery-and-repair",
  "growth-hormone",
];

/** Reorder a Woo category list to lead with the priority slugs. */
export function pinPriorityCategories(list: WCCategory[]): WCCategory[] {
  const priority = PRIORITY_CATEGORY_SLUGS.map((slug) =>
    list.find((c) => c.slug === slug),
  ).filter((c): c is WCCategory => Boolean(c));
  const rest = list.filter(
    (c) => !PRIORITY_CATEGORY_SLUGS.includes(c.slug),
  );
  return [...priority, ...rest];
}
