import Link from "next/link";
import { ShieldCheck, Truck, FileCheck } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const pillars = [
  {
    icon: ShieldCheck,
    title: "99% Purity Assurance",
    body: "Every batch HPLC-tested by ISL Labs. If a lot fails to meet spec, we replace it or refund you.",
  },
  {
    icon: Truck,
    title: "Shipping Protection Included",
    body: "Discreet packaging, same-day fulfilment before 2 pm ET. Damaged shipments reshipped at our cost.",
  },
  {
    icon: FileCheck,
    title: "Certificate of Analysis Included",
    body: "A lot-specific ISL Labs COA ships in every box and appears in our public library before you buy.",
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
            <div className="h-full rounded-md border border-border bg-card p-8">
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/15 text-primary">
                <p.icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
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
