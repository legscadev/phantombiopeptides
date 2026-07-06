import Link from "next/link";
import {
  ShieldCheck,
  Beaker,
  Fingerprint,
  ClipboardCheck,
  FlaskConical,
  ArrowRight,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { CtaSection } from "@/components/marketing/cta-section";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Certificate of Analysis",
  description:
    "Every peptide we sell is third-party tested and ships with full documentation of purity and identity verification.",
  path: "/coa",
});

const STATS = [
  {
    value: "99%+",
    label: "Purity Standard",
    hint: "Minimum HPLC-verified purity per lot.",
  },
  {
    value: "100%",
    label: "Batches Tested",
    hint: "Every batch, every compound, every time.",
  },
  {
    value: "ISO 17025",
    label: "Lab Accreditation",
    hint: "Independent third-party test facility.",
  },
];

const METHODS = [
  {
    icon: FlaskConical,
    title: "HPLC Purity Analysis",
    body: "High-Performance Liquid Chromatography separates and quantifies peptide components to verify 99%+ purity.",
  },
  {
    icon: Beaker,
    title: "Mass Spectrometry",
    body: "Precise molecular-weight verification confirms peptide identity and structural integrity.",
  },
  {
    icon: Fingerprint,
    title: "Identity Verification",
    body: "Amino acid sequence confirmation ensures the compound in the vial matches the labelled research reference.",
  },
  {
    icon: ClipboardCheck,
    title: "Batch Documentation",
    body: "Each batch is accompanied by documented quality controls tracking identity, content, and appearance prior to release.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Visit the product page",
    body: "Every compound in the catalog displays its current batch and links to the corresponding Certificate of Analysis.",
  },
  {
    n: "2",
    title: "Open the COA",
    body: "Click the 'Certificate of Analysis' link below the product description to view the HPLC and mass-spec report for that lot.",
  },
  {
    n: "3",
    title: "Verify the results",
    body: "Review purity percentage, molecular weight confirmation, and test date. The COA is what shipped with your vial.",
  },
];

const COA_FAQ = [
  {
    q: "What is a Certificate of Analysis (COA)?",
    a: "A COA is a signed lab document that confirms the identity, purity, and quality of a compound. It's the objective proof that what's on the label is what's in the vial — issued by an independent lab, not by us.",
  },
  {
    q: "Where can I find the COA for my product?",
    a: "The current batch COA is linked from every product detail page. If you need the COA for the specific lot that shipped with your order, it's included in the box and available on request by emailing us with your order number.",
  },
  {
    q: "How do I read a COA?",
    a: "Look for four things: (1) the compound name and molecular formula, (2) the batch/lot number, (3) the HPLC purity percentage — should read 99% or higher, (4) the test date. Mass spec traces confirm identity by molecular weight.",
  },
  {
    q: "Are your labs accredited?",
    a: "Yes. Our third-party testing partner is an ISO 17025 accredited facility that specialises in peptide analysis. Accreditation means their methods and quality systems are independently audited.",
  },
  {
    q: "How often are peptides tested?",
    a: "Every batch is tested before release — 100% batch coverage, no exceptions. If a lot doesn't hit ≥99% purity, it doesn't ship.",
  },
];

export default function COAPage() {
  return (
    <>
      {/* 1 — HERO (dark ambient) */}
      <section className="bg-ambient-dark relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="animate-blob absolute -left-24 top-16 h-[500px] w-[500px] rounded-full opacity-60 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, #4900AD 0%, transparent 65%)",
            }}
          />
          <div
            className="animate-blob absolute right-[-8rem] top-24 h-[400px] w-[400px] rounded-full opacity-45 blur-[110px]"
            style={{
              background:
                "radial-gradient(circle, #7433FF 0%, transparent 70%)",
              animationDelay: "-7s",
            }}
          />
          <div className="bg-grid-dark absolute inset-0 opacity-55" />
        </div>

        <div className="container-page relative z-10 py-20 md:py-28">
          <Reveal>
            <div className="glass-dark mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/80">
              <BadgeCheck className="h-3 w-3 text-[color:hsl(var(--brand-300))]" />
              Identity verified · Batch-by-batch
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.02em] text-balance text-white sm:text-6xl lg:text-7xl">
              Certificate of{" "}
              <span className="text-brand-gradient">Analysis.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70 text-pretty">
              Every peptide we sell is third-party tested and ships with full
              documentation of purity and identity. Transparency isn&apos;t a
              marketing line — it&apos;s a document.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 — TRUST INTRO + STATS (light) */}
      <section className="relative py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                Transparency you can trust
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                What&apos;s on the label is what&apos;s in the vial.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                A Certificate of Analysis is your proof — signed by the lab,
                tied to a specific batch, published alongside the product.
                Every compound, every lot, every time.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-12 grid gap-5 sm:grid-cols-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass ring-glass rounded-3xl p-8 text-center"
                >
                  <p className="text-brand-gradient font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                    {s.value}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground">
                    {s.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.hint}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 — TESTING METHODS (light) */}
      <section className="relative py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                Our testing methods
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Four checks before a vial leaves the facility.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {METHODS.map((m) => (
                <div
                  key={m.title}
                  className="glass ring-glass rounded-3xl p-7"
                >
                  <div
                    className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                      boxShadow:
                        "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                    }}
                  >
                    <m.icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <h3 className="font-display text-lg font-extrabold tracking-tight">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4 — HOW TO ACCESS (light) */}
      <section className="relative py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                How to access your COA
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Three clicks from the product to the paperwork.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ol className="mt-12 grid gap-5 md:grid-cols-3">
              {STEPS.map((s) => (
                <li
                  key={s.n}
                  className="glass ring-glass relative rounded-3xl p-7"
                >
                  <div
                    className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl font-display text-lg font-extrabold text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                      boxShadow:
                        "0 10px 24px -12px hsl(var(--brand-500) / 0.5)",
                    }}
                  >
                    {s.n}
                  </div>
                  <h3 className="font-display text-lg font-extrabold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <Link href="/shop">
                  Browse products with COA <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5 — FAQ (light) */}
      <section className="relative py-16 md:py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                COA questions
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Everything researchers ask about our testing.
              </h2>
            </div>
          </Reveal>

          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={COA_FAQ} />
          </div>

          {/* Specific COA request card */}
          <Reveal delay={0.1}>
            <div
              className="ring-glass relative mt-12 overflow-hidden rounded-3xl p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--brand-50)) 0%, rgba(255,255,255,0.7) 100%)",
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-40 blur-[100px]"
                style={{
                  background:
                    "radial-gradient(circle, hsl(var(--brand-400)) 0%, transparent 70%)",
                }}
              />
              <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className="mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                    }}
                  >
                    <ShieldCheck className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[color:hsl(var(--brand-500))]">
                      Need a specific COA?
                    </p>
                    <h3 className="mt-2 font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                      We&apos;ll send the lot document from your order.
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      Email us your order number and we&apos;ll reply with the
                      batch-specific PDF within one business day.
                    </p>
                  </div>
                </div>
                <Button size="lg" asChild className="shrink-0">
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    Email support
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — closing CTA (dark) */}
      <CtaSection />
    </>
  );
}
