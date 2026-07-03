import Image from "next/image";
import Link from "next/link";
import { Newspaper, ArrowRight } from "lucide-react";
import { PostsService } from "@/services/posts";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Reveal } from "@/components/common/reveal";
import { buildMetadata } from "@/lib/seo";
import { stripHtml, truncate } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Research journal",
  description:
    "Peptide research protocols, batch reports, and industry updates from the Phantom Bio lab team.",
  path: "/blog",
});

export const revalidate = 600;

export default async function BlogIndexPage() {
  const posts = await PostsService.list(1, 12);

  return (
    <div className="container-page py-10 md:py-14">
      <Reveal>
        <>
          <Breadcrumb crumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
          <div className="mt-6 flex flex-col gap-3 border-b border-border pb-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
              Research journal
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Notes from the lab.
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Protocol notes, batch reports, and observations from our research
              team. Written for people who use these compounds professionally.
            </p>
          </div>
        </>
      </Reveal>

      <Reveal delay={0.08}>
      {posts.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-16 text-center">
          <Newspaper className="mx-auto h-6 w-6 text-muted-foreground" />
          <p className="mt-4 text-lg font-medium">No posts yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The journal will populate as new WordPress posts are published.
          </p>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const media = p._embedded?.["wp:featuredmedia"]?.[0];
            const author = p._embedded?.author?.[0]?.name;
            return (
              <li key={p.id}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-border-strong"
                >
                  {media?.source_url && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-background">
                      <Image
                        src={media.source_url}
                        alt={media.alt_text ?? ""}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-6">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-primary">
                      {new Date(p.date).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <h2
                      className="text-lg font-semibold leading-snug"
                      dangerouslySetInnerHTML={{ __html: p.title.rendered }}
                    />
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {truncate(stripHtml(p.excerpt.rendered), 180)}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3 text-xs text-muted-foreground">
                      {author && <span>By {author}</span>}
                      <span className="inline-flex items-center gap-1 text-primary">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      </Reveal>
    </div>
  );
}
