import Link from "next/link";
import { Package, MapPin, Heart, ArrowRight } from "lucide-react";
import { AuthService } from "@/services/auth";
import { formatPrice } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account dashboard",
  path: "/account",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AccountDashboard() {
  const [session, orders] = await Promise.all([
    AuthService.getSession(),
    AuthService.listOrders(),
  ]);

  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickCard
          icon={Package}
          label="Orders"
          value={orders.length.toString()}
          href="/account/orders"
        />
        <QuickCard icon={MapPin} label="Addresses" value="Manage" href="/account/addresses" />
        <QuickCard icon={Heart} label="Wishlist" value="View" href="/wishlist" />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent orders</h2>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No orders yet. When you place one it&apos;ll appear here.
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/account/orders/${o.id}`}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong"
                >
                  <div>
                    <p className="font-mono text-sm">#{o.number}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(o.date_created).toLocaleDateString()} · {o.line_items.length} item
                      {o.line_items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatPrice(o.total, o.currency)}
                    </p>
                    <p className="mt-1 text-xs capitalize text-muted-foreground">
                      {o.status.replace(/-/g, " ")}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Account email</h2>
        <p className="mt-1 text-sm text-muted-foreground">{session?.email}</p>
      </div>
    </div>
  );
}

function QuickCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Package;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-lg font-semibold">{value}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
    </Link>
  );
}
