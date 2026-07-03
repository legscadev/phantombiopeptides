import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
        404 — Not found
      </p>
      <h1 className="mt-4 text-6xl font-semibold tracking-tight sm:text-7xl">
        This page has been reconstituted.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        The URL you followed doesn&apos;t match anything in our catalog. Try
        heading back home or browsing the shop.
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
        </Button>
      </div>
    </div>
  );
}
