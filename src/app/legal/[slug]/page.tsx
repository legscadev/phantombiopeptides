import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Reveal } from "@/components/common/reveal";
import { LEGAL_DOCS } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(LEGAL_DOCS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) return buildMetadata({ title: "Page not found" });
  return buildMetadata({
    title: doc.title,
    description: doc.description,
    path: `/${slug}`,
  });
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = LEGAL_DOCS[slug];
  if (!doc) notFound();

  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <>
          <Breadcrumb
            crumbs={[{ label: "Home", href: "/" }, { label: doc.title }]}
          />
          <article className="mx-auto mt-10 max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
              {doc.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {doc.title}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">{doc.description}</p>
          </article>
        </>
      </Reveal>
      <Reveal delay={0.08}>
        <article className="mx-auto max-w-3xl">
          <div className="mt-10 space-y-10">
            {doc.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold text-foreground">
                  {s.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </Reveal>
    </div>
  );
}
