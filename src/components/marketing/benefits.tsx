import { Beaker, ShieldCheck, Truck, Award, FileCheck, Snowflake } from "lucide-react";
import { Reveal } from "@/components/common/reveal";

/**
 * "The Phantom Standard" — the one full-width dark section on the light
 * page. Provides a rhythm break between the pastel Guarantee cards
 * above and the Category rail below. Mirrors EVO Labs' "The EVO
 * Standard" section.
 */
const items = [
  {
    icon: Beaker,
    title: "99% Purity, Every Batch",
    body: "HPLC-tested by ISL Labs before every release.",
  },
  {
    icon: FileCheck,
    title: "3rd-Party Verified",
    body: "Independent COAs, traceable to lot number, on every order.",
  },
  {
    icon: Truck,
    title: "Same-Day Dispatch",
    body: "Orders before 2 pm ET ship the same business day.",
  },
  {
    icon: Snowflake,
    title: "Discreet Packaging",
    body: "Vacuum-sealed vials in unmarked, temperature-monitored packaging.",
  },
  {
    icon: ShieldCheck,
    title: "US-Based & Shipped",
    body: "Every order fulfilled from our US facility.",
  },
  {
    icon: Award,
    title: "Volume Discounts",
    body: "Tiered pricing scales automatically for larger orders.",
  },
];

export function Benefits() {
  return (
    <section className="surface-dark relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[120px]" />
      </div>
      <div className="container-page relative">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "hsl(264 100% 72%)" }}>
              Why choose us
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              The Phantom Standard.
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-all hover:border-white/20 hover:bg-white/[0.06]">
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(264 100% 50% / 0.25), hsl(300 66% 50% / 0.15))",
                    color: "hsl(264 100% 78%)",
                  }}
                >
                  <item.icon className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/65">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
