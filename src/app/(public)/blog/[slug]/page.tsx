import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/blog/article-json-ld";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { RelatedPosts } from "@/components/blog/related-posts";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { extractTableOfContents } from "@/lib/blog/utils";
import { getBlogPostBySlug, getBlogPosts, getProfile } from "@/lib/cms/queries";
import { getRelatedBlogPosts } from "@/lib/cms/blog";
import { createMetadata } from "@/lib/seo";
import { cn, formatDate, getDisplayName } from "@/lib/utils";
import { ArrowLeft, Clock } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([getBlogPostBySlug(slug), getProfile()]);
  if (!post) return createMetadata({ title: "Post Not Found", noIndex: true, profile });

  const title = post.meta_title ?? post.title;
  const description = post.meta_description ?? post.excerpt ?? undefined;
  const image = post.og_image ?? post.cover_image ?? undefined;

  const metadata = createMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    image,
    profile,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([getBlogPostBySlug(slug), getProfile()]);
  if (!post) notFound();

  const authorName = getDisplayName(profile.full_name);

  const [relatedPosts, headings] = await Promise.all([
    getRelatedBlogPosts(post),
    Promise.resolve(extractTableOfContents(post.content)),
  ]);

  return (
    <>
      <ArticleJsonLd post={post} authorName={authorName} />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <FadeIn>
          <Link
            href="/blog"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-8 -ml-2")}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to Blog
          </Link>

          {post.cover_image && (
            <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl border border-border/50">
              <Image
                src={post.cover_image}
                alt=""
                fill
                priority
                className="object-cover"
                unoptimized={post.cover_image.startsWith("http")}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <Badge variant="outline" className="capitalize hover:border-primary">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>

          <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            {post.published_at && (
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            )}
            {post.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {post.reading_time} min read
              </span>
            )}
          </div>
        </FadeIn>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_240px]">
          <FadeIn delay={0.2}>
            <div className="prose-blog max-w-3xl">
              <MarkdownContent content={post.content} />
            </div>
          </FadeIn>

          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents headings={headings} />
              </div>
            </aside>
          )}
        </div>

        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  );
}
