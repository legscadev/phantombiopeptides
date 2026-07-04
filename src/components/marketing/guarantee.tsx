import Link from "next/link";
import { ShieldCheck, Truck, FileCheck, ArrowRight } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const pillars = [
  {
    icon: ShieldCheck,
    title: "99% purity assurance",
    body: "Every batch HPLC-tested by ISL Labs. If a lot fails to meet spec, we replace it or refund you.",
  },
  {
    icon: Truck,
    title: "Shipping protection included",
    body: "Discreet packaging, same-day fulfilment before 2 pm ET. Damaged shipments reshipped at our cost.",
  },
  {
    icon: FileCheck,
    title: "Certificate of analysis included",
    body: "A lot-specific ISL Labs Certificate of Analysis ships in every box, tied to your order number.",
  },
];

export function Guarantee() {
  return (
    <Section
      eyebrow="Phantom guarantees"
      title="We don't compromise on quality."
      description="Three commitments backed in writing on every order that leaves our door."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
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
              <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-10 text-center text-xs text-muted-foreground">
        Read the full{" "}
        <Link
          href="/quality"
          className="inline-flex items-center gap-0.5 text-[color:hsl(var(--brand-500))] hover:underline"
        >
          quality &amp; testing policy
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </Section>
  );
}
