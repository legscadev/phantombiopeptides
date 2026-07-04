import Link from "next/link";
import {
  Beaker,
  Microscope,
  ShieldCheck,
  ArrowRight,
  FlaskConical,
} from "lucide-react";
import { Section } from "@/components/common/section";
import { CtaSection } from "@/components/marketing/cta-section";
import { Reveal } from "@/components/common/reveal";
import { Button } from "@/components/ui/button";
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
    body: "Orders placed before 2 pm ET ship same day in discreet, temperature-monitored packaging. Every shipment is tracked from our door to your bench.",
  },
];

const STATS = [
  { n: "10,000+", label: "Orders shipped" },
  { n: "99.4%", label: "Avg. purity" },
  { n: "4.9★", label: "Researcher rating" },
];

const PROCESS = [
  {
    n: "01",
    t: "Synthesis",
    b: "Custom solid-phase synthesis at a certified partner facility. Every batch traced to raw material origin.",
  },
  {
    n: "02",
    t: "Purification",
    b: "Reverse-phase HPLC to 99% purity. Retention data logged and archived alongside the lot.",
  },
  {
    n: "03",
    t: "ISL Labs verification",
    b: "ISL Labs independently confirms mass, purity, and identity. Their Certificate of Analysis is what ships with your order.",
  },
  {
    n: "04",
    t: "Lyophilization",
    b: "Vacuum-dried under sterile conditions. Sealed, labeled, and QC'd for weight uniformity.",
  },
  {
    n: "05",
    t: "Same-day fulfilment",
    b: "Discreet, temperature-monitored packaging. Orders placed before 2 pm ET dispatch the same business day.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 1 — HERO (dark ambient) */}
      <section className="bg-ambient-dark relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="animate-blob absolute -left-24 top-16 h-[520px] w-[520px] rounded-full opacity-65 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #4900AD 0%, transparent 65%)",
            }}
          />
          <div
            className="animate-blob absolute right-[-8rem] top-32 h-[420px] w-[420px] rounded-full opacity-45 blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, #7433FF 0%, transparent 70%)",
              animationDelay: "-7s",
            }}
          />
          <div className="bg-grid-dark absolute inset-0 opacity-60" />
        </div>

        <div className="container-page relative z-10 py-24 md:py-32 lg:py-40">
          <Reveal>
            <div className="glass-dark mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/80">
              <FlaskConical className="h-3 w-3 text-[color:hsl(var(--brand-300))]" />
              About Phantom Bio Peptides
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-6xl lg:text-[80px]">
              The next evolution is{" "}
              <span className="text-brand-gradient">unseen.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty">
              Phantom Bio Peptides supplies research-grade peptides for
              qualified researchers. Every compound we ship is independently
              tested by ISL Labs to a 99% purity minimum — the same COA the
              researcher receives with their order.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 — MISSION / ORIGIN (light glass panel) */}
      <Section eyebrow="Our mission" title="Purity above everything else.">
        <Reveal>
          <div className="glass ring-glass grid gap-8 rounded-3xl p-8 md:p-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-base leading-relaxed text-muted-foreground">
                We started Phantom Bio because we were tired of the gray
                market. Half of the peptides sold under a research label ship
                without a COA, and the ones that do show up are often
                self-published by the seller — the same party grading their
                own homework.
              </p>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Every compound we carry has been independently verified by
                ISL Labs before it&apos;s made available for sale. Full
                Certificate of Analysis — HPLC chromatograms, mass spec
                data, purity percentage — ships in every box, tied to the
                order number. If a batch doesn&apos;t clear 99% purity, it
                doesn&apos;t leave the facility.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild>
                  <Link href="/shop">
                    Shop the catalog <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/contact">Talk to a researcher</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {STATS.slice(0, 4).map((s) => (
                <div
                  key={s.label}
                  className="glass ring-glass rounded-2xl p-6"
                >
                  <div className="text-brand-gradient font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                    {s.n}
                  </div>
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
              <div className="glass ring-glass col-span-2 rounded-2xl p-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[color:hsl(var(--brand-500))]">
                  Independently tested by
                </p>
                <p className="mt-2 font-display text-xl font-extrabold tracking-tight">
                  ISL Labs
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Every batch. Every box. Every order.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 3 — COMMITMENTS (light glass cards) */}
      <Section
        eyebrow="Our commitment"
        title="What we don't compromise on."
        description="Three commitments enforced on every shipment that leaves the facility."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="glass ring-glass group h-full rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1">
                <div
                  className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                    boxShadow:
                      "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                  }}
                >
                  <p.icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-xl font-extrabold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 4 — PROCESS (light timeline) */}
      <Section
        eyebrow="Our process"
        title="From synthesis to shipment."
        description="Five checkpoints between a raw material order and a vial on your bench."
      >
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROCESS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05}>
              <li className="glass ring-glass h-full rounded-3xl p-7">
                <span
                  className="inline-flex h-10 min-w-[3rem] items-center justify-center rounded-full px-3 font-mono text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                    boxShadow:
                      "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                  }}
                >
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold tracking-tight">
                  {step.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.b}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* 5 — CTA (dark ambient banner) */}
      <CtaSection />
    </>
  );
}
