import { Beaker, Award, Microscope, ShieldCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { CtaSection } from "@/components/marketing/cta-section";
import { Reveal } from "@/components/common/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Phantom Labs is a research supply lab delivering HPLC-verified peptides with cold-chain shipping.",
  path: "/about",
});

const pillars = [
  {
    icon: Beaker,
    title: "Pharma-grade manufacturing",
    body: "Compounds synthesized in ISO-9001 facilities using USP-grade solvents and excipients. Every batch is lyophilized under vacuum, sealed, and QC'd before it ever touches a shipping label.",
  },
  {
    icon: Microscope,
    title: "Third-party verification",
    body: "We contract independent labs to HPLC-verify each lot at ≥99% purity. Their COAs — not ours — ship with your order. If it isn't verifiable, it doesn't go out.",
  },
  {
    icon: ShieldCheck,
    title: "Cold-chain fulfillment",
    body: "Temperature-monitored packaging, insulated containers, and gel-pack cooling. Every shipment gets tracked from our door to your bench with an audit trail.",
  },
  {
    icon: Award,
    title: "Research support",
    body: "Direct access to our lab team for protocol design, reconstitution, and re-orders. We are here to make your work reproducible, not merely to sell you compounds.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        </div>
        <div className="container-page py-24 md:py-32">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
              About Phantom Labs
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
              A research supply lab, engineered like a pharmaceutical brand.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
              We started Phantom Labs because we were tired of ordering research
              peptides from vendors whose COAs read like marketing copy. Our
              customers are principal investigators, research associates, and
              lab technicians — the people whose work depends on knowing exactly
              what showed up in the box.
            </p>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="What we stand for" title="Four commitments.">
        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-8">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background-elevated text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section eyebrow="Our process" title="From synthesis to shipment.">
        <ol className="relative space-y-8 border-l border-border pl-8">
          {[
            {
              t: "01 · Synthesis",
              b: "Custom solid-phase synthesis at a certified partner facility. Every batch traced to raw material origin.",
            },
            {
              t: "02 · Purification",
              b: "Reverse-phase HPLC to ≥99% purity. Retention data logged and archived alongside the lot.",
            },
            {
              t: "03 · Verification",
              b: "Independent lab confirms mass, purity, and identity. Their COA is what ships with your order.",
            },
            {
              t: "04 · Lyophilization",
              b: "Vacuum-dried under sterile conditions. Sealed, labeled, and QC'd for weight uniformity.",
            },
            {
              t: "05 · Cold-chain fulfillment",
              b: "Insulated containers with gel-pack cooling. Overnight or 2-day. Every shipment tracked.",
            },
          ].map((step, i) => (
            <li key={i} className="relative">
              <h3 className="font-mono text-xs uppercase tracking-widest text-primary">
                {step.t}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {step.b}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaSection />
    </>
  );
}
