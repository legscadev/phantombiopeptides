import Link from "next/link";
import { ShieldCheck, Truck, FileCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

/**
 * 3-pillar guarantee section — EVO-style colored pastels with Phantom's
 * violet-family palette. Colored cards sit on the light page bg and
 * break up the visual rhythm.
 */
const pillars = [
  {
    icon: ShieldCheck,
    title: "99% Purity Assurance",
    body: "Every batch HPLC-tested by ISL Labs. If a lot fails to meet spec, we replace it or refund you.",
    bg: "bg-pastel-mint",
    fg: "text-pastel-mint-fg",
  },
  {
    icon: Truck,
    title: "Shipping Protection Included",
    body: "Discreet packaging, same-day fulfilment before 2 pm ET. Damaged shipments reshipped at our cost.",
    bg: "bg-pastel-blue",
    fg: "text-pastel-blue-fg",
  },
  {
    icon: FileCheck,
    title: "Certificate of Analysis Included",
    body: "A lot-specific ISL Labs COA ships in every box and appears in our public library before you buy.",
    bg: "bg-pastel-violet",
    fg: "text-pastel-violet-fg",
  },
];

export function Guarantee() {
  return (
    <Section
      eyebrow="Phantom Guarantees"
      title="We don't compromise on quality."
      description="Three commitments backed in writing on every order that leaves our door."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div
              className={`h-full rounded-2xl border border-black/5 p-8 shadow-sm ${p.bg}`}
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/80 ${p.fg}`}
              >
                <p.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className={`font-display text-lg font-bold ${p.fg}`}>
                {p.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${p.fg} opacity-85`}>
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground">
        Read the full{" "}
        <Link href="/quality" className="text-primary hover:underline">
          quality &amp; testing policy
        </Link>
        .
      </div>
    </Section>
  );
}
