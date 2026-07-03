import { Building2, Truck, ShieldCheck, TrendingDown } from "lucide-react";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { WholesaleForm } from "./wholesale-form";
import { Reveal } from "@/components/common/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Wholesale & institutional orders",
  description:
    "Bulk peptide research supply with tiered pricing for research institutions, labs, and study groups.",
  path: "/wholesale",
});

const perks = [
  {
    icon: TrendingDown,
    title: "Tiered pricing",
    body: "Volume discounts scale automatically from 10 to 100+ vial orders.",
  },
  {
    icon: Truck,
    title: "Priority fulfillment",
    body: "Wholesale orders are prioritized in our daily dispatch queue.",
  },
  {
    icon: ShieldCheck,
    title: "Lot reservation",
    body: "Reserve a specific lot for reproducibility across a study.",
  },
  {
    icon: Building2,
    title: "Institutional invoicing",
    body: "Net-30 terms available for research institutions after review.",
  },
];

export default function WholesalePage() {
  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb
        crumbs={[{ label: "Home", href: "/" }, { label: "Wholesale" }]}
      />
      <div className="mt-8 grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
            Wholesale
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Built for research at scale.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Purpose-built pricing and support for institutional buyers,
            university labs, and multi-site studies. Tell us about your
            program and we&apos;ll respond within one business day.
          </p>
          <ul className="mt-10 space-y-5">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <li className="flex items-start gap-4">
                  <div className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
                    <p.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {p.body}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 md:p-10">
          <WholesaleForm />
        </div>
      </div>
    </div>
  );
}
