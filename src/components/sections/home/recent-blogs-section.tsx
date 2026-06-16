"use client";

import { BlogCard } from "@/components/cards/blog-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionShell } from "@/components/sections/section-shell";
import type { BlogPost } from "@/types/database";

interface RecentBlogsSectionProps {
  posts: BlogPost[];
}

export function RecentBlogsSection({ posts }: RecentBlogsSectionProps) {
  return (
    <SectionShell id="blog" ariaLabelledBy="blog-heading">
      <SectionHeader
        eyebrow="Writing"
        title="Recent Blogs"
        titleId="blog-heading"
        description="Thoughts on engineering craft, architecture decisions, and lessons from the field."
        href="/blog"
        linkLabel="Read all posts"
      />

      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <StaggerItem key={post.id}>
            <BlogCard post={post} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
