"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-destructive">
        Unexpected error
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Our team has been notified. You can try again — if the issue persists,
        please contact support.
      </p>
      <Button onClick={reset} className="mt-8">
        <RefreshCcw className="h-4 w-4" />
        Try again
      </Button>
      {error.digest && (
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {error.digest}
        </p>
      )}
    </div>
  );
}
