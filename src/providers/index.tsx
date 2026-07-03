"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CartProvider } from "@/hooks/use-cart";
import type { WCCart } from "@/types";

export function Providers({
  initialCart,
  children,
}: {
  initialCart: WCCart | null;
  children: React.ReactNode;
}) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <CartProvider initialCart={initialCart}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "!bg-background-elevated !border-border !text-foreground !rounded-xl",
            },
          }}
        />
      </CartProvider>
    </QueryClientProvider>
  );
}
