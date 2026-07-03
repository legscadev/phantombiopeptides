import { Star } from "lucide-react";
import { Section } from "@/components/common/section";
import { Reveal } from "@/components/common/reveal";

const testimonials = [
  {
    quote:
      "The COAs are the cleanest I've seen from any supplier. HPLC traces are consistent across lots and their turnaround has never slipped a beat.",
    author: "Dr. Meredith Chen",
    role: "Principal Investigator, Cell Biology",
  },
  {
    quote:
      "Cold-chain packaging arrived intact after a two-day transit in July. The vials were still under 6°C. That's the level of care research needs.",
    author: "Lars Fischer",
    role: "Research Associate",
  },
  {
    quote:
      "Documentation, sterility, reconstitution behavior — all reproducible. We've moved every peptide order through Phantom Labs since 2024.",
    author: "R. Okafor, PhD",
    role: "Metabolic Research Lead",
  },
];

export function Testimonials() {
  return (
    <Section
      eyebrow="Trusted by labs"
      title="What researchers are saying."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <figure className="h-full rounded-2xl border border-border bg-card p-8">
              <div className="flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 text-xs">
                <div className="font-medium">{t.author}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
