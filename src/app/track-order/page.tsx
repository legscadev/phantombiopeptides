import { PackageSearch } from "lucide-react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Reveal } from "@/components/common/reveal";
import { TrackOrderForm } from "./track-order-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Track your order",
  description:
    "Enter your order number and email to see live tracking status.",
  path: "/track-order",
  noIndex: true,
});

export default function TrackOrderPage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <>
          <Breadcrumb
            crumbs={[{ label: "Home", href: "/" }, { label: "Track order" }]}
          />
          <div className="mx-auto mt-8 max-w-lg text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background-elevated text-primary">
              <PackageSearch className="h-5 w-5" />
            </div>
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-primary">
              Order tracking
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Where&apos;s my order?
            </h1>
            <p className="mt-3 text-muted-foreground">
              Enter your order number and the email used at checkout to see the
              latest status.
            </p>
          </div>
        </>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8">
          <TrackOrderForm />
        </div>
      </Reveal>
    </div>
  );
}
