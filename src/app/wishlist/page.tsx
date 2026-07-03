import { Heart } from "lucide-react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { WishlistClient } from "./wishlist-client";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wishlist",
  description: "Compounds you've saved for later.",
  path: "/wishlist",
  noIndex: true,
});

export default function WishlistPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb
        crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <div className="mt-8 flex items-center gap-3">
        <Heart className="h-5 w-5 text-primary" />
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your wishlist
        </h1>
      </div>
      <WishlistClient />
    </div>
  );
}
