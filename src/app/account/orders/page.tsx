import Link from "next/link";
import { AuthService } from "@/services/auth";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { Package } from "lucide-react";

export const metadata = buildMetadata({
  title: "Orders",
  path: "/account/orders",
  noIndex: true,
});

export const dynamic = "force-dynamic";

const STATUS_TONE: Record<string, string> = {
  processing: "text-warning",
  completed: "text-success",
  "on-hold": "text-warning",
  cancelled: "text-destructive",
  refunded: "text-destructive",
  failed: "text-destructive",
  pending: "text-muted-foreground",
};

export default async function AccountOrdersPage() {
  const orders = await AuthService.listOrders();

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-16 text-center">
        <Package className="h-6 w-6 text-muted-foreground" />
        <p className="text-lg font-medium">No orders yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Once you place your first order it will show up here with tracking info.
        </p>
        <Link
          href="/shop"
          className="mt-2 inline-flex text-sm text-primary hover:underline"
        >
          Browse the shop →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order history</h2>
        <span className="text-xs text-muted-foreground">
          {orders.length} order{orders.length === 1 ? "" : "s"}
        </span>
      </div>
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id}>
            <Link
              href={`/account/orders/${o.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong"
            >
              <div className="min-w-0">
                <p className="font-mono text-sm">#{o.number}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {new Date(o.date_created).toLocaleDateString()} ·{" "}
                  {o.line_items
                    .slice(0, 2)
                    .map((li) => `${li.quantity}× ${li.name}`)
                    .join(", ")}
                  {o.line_items.length > 2 && ` +${o.line_items.length - 2} more`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatPrice(o.total, o.currency)}
                </p>
                <p
                  className={`mt-1 text-xs capitalize ${STATUS_TONE[o.status] ?? "text-muted-foreground"}`}
                >
                  {o.status.replace(/-/g, " ")}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
