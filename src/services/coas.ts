import "server-only";
import data from "@/data/coas.json";

export interface CoaEntry {
  id: string;
  product_slug: string;
  product_name: string;
  dose: string;
  purity: number;
  pdf_url: string;
  thumb_url?: string;
}

export interface CoaBatch {
  batch: string;
  issued_at: string;
  lab: string;
  verification_url?: string;
  coas: CoaEntry[];
}

interface CoaData {
  batches: CoaBatch[];
}

const coaData = data as CoaData;

export const CoasService = {
  list(): CoaBatch[] {
    // Sort batches newest first; each batch's coas by product name.
    return [...coaData.batches]
      .sort((a, b) => b.issued_at.localeCompare(a.issued_at))
      .map((b) => ({
        ...b,
        coas: [...b.coas].sort((a, c) => a.product_name.localeCompare(c.product_name)),
      }));
  },

  byProductSlug(slug: string): { batch: string; entry: CoaEntry }[] {
    const out: { batch: string; entry: CoaEntry }[] = [];
    for (const b of coaData.batches) {
      for (const c of b.coas) {
        if (c.product_slug === slug) out.push({ batch: b.batch, entry: c });
      }
    }
    return out;
  },

  totalCount(): number {
    return coaData.batches.reduce((sum, b) => sum + b.coas.length, 0);
  },
};
