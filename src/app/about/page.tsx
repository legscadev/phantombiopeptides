import { Beaker, Award, Microscope, ShieldCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { CtaSection } from "@/components/marketing/cta-section";
import { Reveal } from "@/components/common/reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Phantom Bio Peptides supplies research-use peptides independently verified by ISL Labs.",
  path: "/about",
});

const pillars = [
  {
    icon: Beaker,
    title: "Pharma-grade sourcing",
    body: "Compounds synthesized at ISO-certified partner facilities using USP-grade solvents and excipients. Every batch is lyophilized, sealed, and QC'd before it ever touches a shipping label.",
  },
  {
    icon: Microscope,
    title: "ISL Labs verification",
    body: "Every lot is HPLC-verified at 99% purity or higher by ISL Labs — independently, not by us. Their COA is what ships in your box.",
  },
  {
    icon: ShieldCheck,
    title: "Same-day fulfilment",
    body: "Orders placed before 2 pm ET ship same day in discreet packaging. Every shipment is tracked from our door to your bench.",
  },
  {
    icon: Award,
    title: "Free shipping over $250",
    body: "Complimentary shipping on qualifying US orders. Overnight and 2-day options available at checkout.",
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
              About Phantom Bio Peptides
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              The next evolution is unseen.
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty leading-relaxed">
              Phantom Bio Peptides supplies research-grade peptides for
              qualified researchers. Every compound we ship is independently
              tested by ISL Labs to a 99% purity minimum — the same COA the
              researcher receives with their order.
            </p>
          </Reveal>
        </div>
      </section>

      <Section eyebrow="Our commitment" title="Four things we don't compromise on.">
        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{p.title}</h3>
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
              b: "Reverse-phase HPLC to 99% purity. Retention data logged and archived alongside the lot.",
            },
            {
              t: "03 · ISL Labs verification",
              b: "ISL Labs confirms mass, purity, and identity. Their Certificate of Analysis is what ships with your order.",
            },
            {
              t: "04 · Lyophilization",
              b: "Vacuum-dried under sterile conditions. Sealed, labeled, and QC'd for weight uniformity.",
            },
            {
              t: "05 · Same-day fulfilment",
              b: "Discreet packaging. Orders placed before 2 pm ET dispatch the same business day.",
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
