import { BlogListing } from "@/components/blog/blog-listing";
import { FadeIn } from "@/components/motion/fade-in";
import { getBlogPosts } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Blog",
  description: "Articles on full-stack development, architecture, and modern web technologies.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const posts = await getBlogPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Writing about engineering, design systems, and lessons learned building products.
        </p>
      </FadeIn>

      <BlogListing posts={posts} initialTag={tag ?? null} />
    </div>
  );
}
