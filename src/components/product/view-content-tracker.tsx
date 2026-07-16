"use client";

import * as React from "react";
import { trackViewContent } from "@/lib/tiktok";

// Fires a TikTok ViewContent event when a product page mounts.
export function ViewContentTracker({
  id,
  name,
  price,
}: {
  id: number | string;
  name: string;
  price?: string | number | null;
}) {
  React.useEffect(() => {
    trackViewContent({ id, name, price });
  }, [id, name, price]);

  return null;
}
