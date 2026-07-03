import { Beaker, ShieldCheck, Truck, Award, FileCheck, Snowflake } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const items = [
  {
    icon: Beaker,
    title: "HPLC verified",
    body: "Every batch tested at ≥99% purity via high-performance liquid chromatography before release.",
  },
  {
    icon: FileCheck,
    title: "Third-party COAs",
    body: "Independent Certificates of Analysis included with every order — traceable to lot number.",
  },
  {
    icon: Snowflake,
    title: "Cold-chain shipping",
    body: "Temperature-monitored fulfillment with insulated packaging and gel-pack cooling.",
  },
  {
    icon: ShieldCheck,
    title: "Sterile manufacture",
    body: "ISO-9001 certified facilities. Lyophilized under vacuum with USP-grade excipients.",
  },
  {
    icon: Truck,
    title: "Fast dispatch",
    body: "Orders placed before 2pm ET ship same day. Overnight & 2-day options available.",
  },
  {
    icon: Award,
    title: "Research support",
    body: "Direct access to our lab team for protocol questions and reconstitution guidance.",
  },
];

export function Benefits() {
  return (
    <Section
      eyebrow="Why Phantom Labs"
      title="Built for repeatable science."
      description="Every compound we ship is treated like it belongs in your protocol — because it does."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06}>
            <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-border-strong">
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-transparent to-accent/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
