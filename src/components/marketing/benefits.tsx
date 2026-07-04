import {
  Beaker,
  ShieldCheck,
  Truck,
  Award,
  FileCheck,
  Snowflake,
} from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const items = [
  {
    icon: Beaker,
    title: "99% purity, every batch",
    body: "HPLC-tested by ISL Labs before every release.",
  },
  {
    icon: FileCheck,
    title: "3rd-party verified",
    body: "Independent COAs, traceable to lot number, on every order.",
  },
  {
    icon: Truck,
    title: "Same-day dispatch",
    body: "Orders before 2 pm ET ship the same business day.",
  },
  {
    icon: Snowflake,
    title: "Discreet packaging",
    body: "Vacuum-sealed vials in unmarked, temperature-monitored packaging.",
  },
  {
    icon: ShieldCheck,
    title: "US-based & shipped",
    body: "Every order fulfilled from our US facility.",
  },
  {
    icon: Award,
    title: "Volume discounts",
    body: "Tiered pricing scales automatically for larger orders.",
  },
];

export function Benefits() {
  return (
    <Section
      eyebrow="Why choose us"
      title="The Phantom Standard."
      description="Six commitments we enforce on every shipment that leaves the facility."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.05}>
            <div className="glass ring-glass group h-full rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1">
              <div
                className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                  boxShadow:
                    "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                }}
              >
                <item.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="font-display text-lg font-extrabold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
