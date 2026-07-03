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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <div className="relative h-full rounded-2xl border border-border bg-card p-8">
              <span className="font-mono text-xs text-primary/80">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <span className="pointer-events-none absolute right-4 top-8 hidden text-muted-foreground/40 md:block">
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
