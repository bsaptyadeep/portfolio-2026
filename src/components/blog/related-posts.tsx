import Link from "next/link";
import { BlogCard } from "@/components/cards/blog-card";
import type { BlogPost } from "@/types/database";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/50 pt-12" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-xl font-bold tracking-tight sm:text-2xl">
        Related articles
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      <Link
        href="/blog"
        className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
      >
        View all posts →
      </Link>
    </section>
  );
}
