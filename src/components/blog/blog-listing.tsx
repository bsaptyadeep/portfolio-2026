"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { BlogCard } from "@/components/cards/blog-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { collectAllTags, filterPostsClient } from "@/lib/blog/utils";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/database";

interface BlogListingProps {
  posts: BlogPost[];
  initialTag?: string | null;
}

export function BlogListing({ posts, initialTag = null }: BlogListingProps) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(initialTag);

  const tags = useMemo(() => collectAllTags(posts), [posts]);

  const filtered = useMemo(
    () => filterPostsClient(posts, query, activeTag),
    [posts, query, activeTag]
  );

  return (
    <div>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            type="search"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search blog posts"
          />
        </div>
        {(query || activeTag) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveTag(null);
            }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
            Clear filters
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2" role="list" aria-label="Filter by tag">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Badge
                variant={activeTag === tag ? "default" : "outline"}
                className={cn("cursor-pointer capitalize")}
              >
                {tag}
              </Badge>
            </button>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        {filtered.length} {filtered.length === 1 ? "article" : "articles"}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full py-12 text-center text-muted-foreground">
            No articles match your search.
          </p>
        ) : (
          filtered.map((post) => <BlogCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
