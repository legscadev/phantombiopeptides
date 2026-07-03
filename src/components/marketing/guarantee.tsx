import Link from "next/link";
import { ShieldCheck, Truck, FileCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

/**
 * 3-pillar guarantee section. Mirrors EVO Labs' pastel-card layout but
 * with three violet family surfaces so the site stays on-brand.
 */
const pillars = [
  {
    icon: ShieldCheck,
    title: "99% Purity Assurance",
    body: "Every batch HPLC-tested by ISL Labs. If a lot fails to meet spec, we replace it or refund you.",
    gradient:
      "radial-gradient(120% 100% at 20% 0%, hsl(264 100% 40% / 0.85) 0%, hsl(262 90% 22% / 0.85) 50%, hsl(0 0% 6%) 100%)",
    border: "border-primary/40",
  },
  {
    icon: Truck,
    title: "Shipping Protection Included",
    body: "Discreet packaging, same-day fulfilment before 2 pm ET. Damaged shipments reshipped at our cost.",
    gradient:
      "radial-gradient(120% 100% at 80% 0%, hsl(245 66% 32% / 0.75) 0%, hsl(262 40% 14% / 0.9) 55%, hsl(0 0% 6%) 100%)",
    border: "border-indigo-500/30",
  },
  {
    icon: FileCheck,
    title: "Certificate of Analysis Included",
    body: "A lot-specific ISL Labs COA ships in every box and appears in our public library before you buy.",
    gradient:
      "radial-gradient(120% 100% at 50% 0%, hsl(300 66% 36% / 0.7) 0%, hsl(280 60% 18% / 0.85) 55%, hsl(0 0% 6%) 100%)",
    border: "border-fuchsia-500/30",
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
              className={`relative h-full overflow-hidden rounded-2xl border p-8 ${p.border}`}
              style={{ background: p.gradient }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
              <div className="relative">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-white/10 text-white backdrop-blur">
                  <p.icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
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
          quality &amp; testing policy
        </Link>
        .
      </div>
    </Section>
  );
}
