"use client";

import * as React from "react";
import { useCart } from "@/hooks/use-cart";

export function CartRefresh() {
  const { refresh } = useCart();
  React.useEffect(() => {
    void refresh();
  }, [refresh]);
  return null;
}
