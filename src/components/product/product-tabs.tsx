"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { WCProduct, WCReview } from "@/types";
import { Star } from "lucide-react";

interface Props {
  product: WCProduct;
  reviews: WCReview[];
}

export function ProductTabs({ product, reviews }: Props) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specs">Specifications</TabsTrigger>
        <TabsTrigger value="usage">Research use</TabsTrigger>
        <TabsTrigger value="reviews">
          Reviews ({product.rating_count})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <div
          className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-3xl [&_p]:mb-4 [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </TabsContent>

      <TabsContent value="specs">
        <div className="max-w-2xl divide-y divide-border rounded-2xl border border-border bg-card">
          <Row label="SKU" value={product.sku || String(product.id)} />
          {product.attributes.map((a) => (
            <Row key={a.name} label={a.name} value={a.options.join(", ")} />
          ))}
          <Row
            label="Category"
            value={product.categories.map((c) => c.name).join(", ")}
          />
          <Row
            label="Stock status"
            value={
              product.stock_status === "instock"
                ? "In stock"
                : product.stock_status === "onbackorder"
                  ? "Backorder"
                  : "Out of stock"
            }
          />
        </div>
      </TabsContent>

      <TabsContent value="usage">
        <div className="max-w-3xl space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            This compound is offered strictly for laboratory research and
            in-vitro applications. It is not intended for human consumption,
            therapeutic use, or diagnostic purposes.
          </p>
          <p>
            Reconstitute with bacteriostatic water at 2–8°C and use within 30
            days, or aliquot and freeze at −20°C for longer storage. Refer to
            the enclosed Certificate of Analysis for lot-specific handling
            guidance.
          </p>
          <p>
            Buyers assume all responsibility for compliance with local, state,
            and federal regulations governing the receipt and use of research
            chemicals.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No reviews yet. Be the first to leave one.
          </p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.reviewer}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.date_created).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < r.rating
                            ? "h-3.5 w-3.5 fill-warning text-warning"
                            : "h-3.5 w-3.5 text-border"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
                  {r.review}
                </p>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-4 px-5 py-4 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="col-span-2 text-foreground/90">{value}</dd>
    </div>
  );
}
