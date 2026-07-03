import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PostsService } from "@/services/posts";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { buildMetadata } from "@/lib/seo";
import { stripHtml, truncate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    return (await PostsService.getAllSlugs()).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await PostsService.getBySlug(slug);
  if (!post) return buildMetadata({ title: "Post not found" });
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return buildMetadata({
    title: stripHtml(post.title.rendered),
    description: truncate(stripHtml(post.excerpt.rendered), 180),
    path: `/blog/${post.slug}`,
    images: media?.source_url ? [media.source_url] : undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await PostsService.getBySlug(slug);
  if (!post) notFound();

  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const author = post._embedded?.author?.[0]?.name;

  return (
    <article className="container-page py-10 md:py-14">
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: stripHtml(post.title.rendered) },
        ]}
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-primary">
          {new Date(post.date).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          {author && ` · By ${author}`}
        </p>
        <h1
          className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        {media?.source_url && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
            <Image
              src={media.source_url}
              alt={media.alt_text ?? ""}
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        )}
        <div
          className="prose prose-invert mt-10 max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed prose-headings:tracking-tight prose-a:text-primary [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        <div className="mt-16 border-t border-border pt-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All journal posts
          </Link>
        </div>
      </div>
    </article>
  );
}
