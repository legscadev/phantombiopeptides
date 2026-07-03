import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthService } from "@/services/auth";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = buildMetadata({
  title: "Order detail",
  path: "/account/orders",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await AuthService.getOrder(Number(id));
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-sm">Order #{order.number}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Placed {new Date(order.date_created).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ArrowLeft className="h-3 w-3" /> All orders
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Status" value={order.status.replace(/-/g, " ")} />
        <StatCard label="Total" value={formatPrice(order.total, order.currency)} />
      </div>

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Items
          </h2>
        </div>
        <ul className="divide-y divide-border">
          {order.line_items.map((li) => (
            <li
              key={li.id}
              className="flex items-center justify-between gap-4 px-6 py-4 text-sm"
            >
              <span>
                <span className="text-muted-foreground">{li.quantity} ×</span>{" "}
                {li.name}
              </span>
              <span className="font-medium">
                {formatPrice(li.total, order.currency)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {order.shipping_lines && order.shipping_lines.length > 0 && (
        <div className="rounded-2xl border border-border bg-card px-6 py-5 text-sm">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Shipping
          </p>
          <ul className="mt-2 space-y-1">
            {order.shipping_lines.map((s, i) => (
              <li key={i} className="flex justify-between">
                <span>{s.method_title}</span>
                <span>{formatPrice(s.total, order.currency)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold capitalize">{value}</p>
    </div>
  );
}
