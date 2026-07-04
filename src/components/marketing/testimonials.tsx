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
            <figure className="glass ring-glass group relative h-full overflow-hidden rounded-3xl p-8 transition-transform duration-500 hover:-translate-y-1">
              <span
                aria-hidden
                className="text-brand-gradient pointer-events-none absolute -top-6 left-4 select-none font-display text-[110px] font-extrabold leading-none opacity-50"
              >
                &ldquo;
              </span>
              <div className="relative flex gap-0.5" aria-hidden>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-3.5 w-3.5 fill-[color:hsl(var(--brand-400))] text-[color:hsl(var(--brand-400))]"
                  />
                ))}
              </div>
              <blockquote className="relative mt-5 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="relative mt-6 text-xs">
                <div className="font-semibold text-foreground">{t.author}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
