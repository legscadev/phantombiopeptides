import { AuthService } from "@/services/auth";
import { AddressForm } from "./address-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Addresses",
  path: "/account/addresses",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const customer = await AuthService.getCustomer();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Billing address</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Used by default on new orders. You can override at checkout.
        </p>
      </div>
      <AddressForm
        kind="billing"
        defaults={customer?.billing}
        includeEmailPhone
      />

      <div>
        <h2 className="text-lg font-semibold">Shipping address</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Where research shipments are delivered.
        </p>
      </div>
      <AddressForm kind="shipping" defaults={customer?.shipping} />
    </div>
  );
}
