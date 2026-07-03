import Link from "next/link";
import { ShieldCheck, Truck, FileCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const pillars = [
  {
    icon: ShieldCheck,
    title: "99%+ purity, guaranteed",
    body: "Every batch tested via HPLC. If a lot fails to meet spec, we replace it or refund you — no questions.",
  },
  {
    icon: Truck,
    title: "Free shipment protection",
    body: "Damaged in transit? Lost package? We reship at our cost. Every order fully covered.",
  },
  {
    icon: FileCheck,
    title: "COA with every order",
    body: "A lot-specific Certificate of Analysis ships in every box — independently issued, not a marketing PDF.",
  },
];

export function Guarantee() {
  return (
    <Section
      eyebrow="Our guarantee"
      title="We don't compromise on quality."
      description="Three commitments backed in writing on every order that leaves our door."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
                  <p.icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        Read the full{" "}
        <Link href="/quality" className="text-primary hover:underline">
          quality & testing policy
        </Link>
        .
      </div>
    </Section>
  );
}
