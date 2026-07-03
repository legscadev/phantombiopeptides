import type { WCCategory } from "@/types";

// picsum.photos with a stable seed — deterministic, cacheable, always
// available for mock category imagery. Real WooCommerce category images
// take over when NEXT_PUBLIC_USE_MOCKS is flipped to false.
const catImg = (seed: string, alt: string) => ({
  src: `https://picsum.photos/seed/cat-${seed}/1200/900`,
  name: alt,
  alt,
});

export const mockCategories: WCCategory[] = [
  {
    id: 10,
    name: "Research Peptides",
    slug: "research-peptides",
    description: "High-purity research peptides for laboratory use.",
    count: 12,
    image: catImg("research-peptides", "Vials on a lab bench"),
    parent: 0,
  },
  {
    id: 11,
    name: "Longevity",
    slug: "longevity",
    description: "Compounds studied for cellular repair and healthspan.",
    count: 6,
    image: catImg("longevity", "Abstract cellular imagery"),
    parent: 0,
  },
  {
    id: 12,
    name: "Metabolic",
    slug: "metabolic",
    description: "Peptides implicated in metabolic regulation research.",
    count: 5,
    image: catImg("metabolic", "Molecular structure visualization"),
    parent: 0,
  },
  {
    id: 13,
    name: "Recovery",
    slug: "recovery",
    description: "Compounds studied for tissue repair and inflammation.",
    count: 4,
    image: catImg("recovery", "Lab microscope"),
    parent: 0,
  },
  {
    id: 14,
    name: "Cognitive",
    slug: "cognitive",
    description: "Nootropic-adjacent peptide research compounds.",
    count: 3,
    image: catImg("cognitive", "Neural network visualization"),
    parent: 0,
  },
  {
    id: 15,
    name: "Blends",
    slug: "blends",
    description: "Curated multi-compound research kits.",
    count: 3,
    image: catImg("blends", "Glass vials arranged on surface"),
    parent: 0,
  },
];
