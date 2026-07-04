import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const steps = [
  {
    n: "01",
    title: "Explore the catalog",
    body: "Browse HPLC-verified compounds by category, mechanism, or research area.",
  },
  {
    n: "02",
    title: "Review documentation",
    body: "Every product ships with a lot-specific COA and reconstitution reference.",
  },
  {
    n: "03",
    title: "Order & receive",
    body: "Cold-chain fulfillment via insulated overnight shipping, tracked to your bench.",
  },
  {
    n: "04",
    title: "Run your protocol",
    body: "Reproducible results, backed by lab support for edge cases and re-orders.",
  },
];

export function HowItWorks() {
  return (
    <Section
      eyebrow="How it works"
      title="Four steps from catalog to bench."
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="glass ring-glass relative h-full rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1">
              <span
                className="inline-flex items-center justify-center rounded-full px-3 py-1 font-mono text-[11px] font-semibold tracking-[0.18em] text-white"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--brand-500)) 0%, hsl(var(--brand-400)) 100%)",
                  boxShadow:
                    "0 8px 20px -10px hsl(var(--brand-500) / 0.55)",
                }}
              >
                {s.n}
              </span>
              <h3 className="mt-5 font-display text-lg font-extrabold tracking-tight text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <span className="pointer-events-none absolute right-5 top-8 hidden text-[color:hsl(var(--brand-300))] md:block">
                  →
                </span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
