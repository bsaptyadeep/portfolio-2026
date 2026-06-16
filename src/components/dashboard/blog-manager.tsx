"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { AlertBanner, ConfirmDeleteButton } from "@/components/dashboard/alert-banner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  deleteBlogPost,
  toggleBlogPublished,
} from "@/lib/actions/admin/blog";
import { formatDate, cn } from "@/lib/utils";
import type { BlogPost } from "@/types/database";

interface BlogManagerProps {
  initialPosts: BlogPost[];
}

type OptimisticAction =
  | { type: "delete"; id: string }
  | { type: "toggle"; id: string; published: boolean };

function postsReducer(posts: BlogPost[], action: OptimisticAction) {
  switch (action.type) {
    case "delete":
      return posts.filter((p) => p.id !== action.id);
    case "toggle":
      return posts.map((p) =>
        p.id === action.id ? { ...p, published: action.published } : p
      );
    default:
      return posts;
  }
}

export function BlogManager({ initialPosts }: BlogManagerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimisticPosts, updateOptimistic] = useOptimistic(
    initialPosts,
    postsReducer
  );

  function handleToggle(id: string, published: boolean) {
    setError(null);
    startTransition(async () => {
      updateOptimistic({ type: "toggle", id, published });
      const result = await toggleBlogPublished(id, published);
      if (!result.success) setError(result.error);
    });
  }

  function handleDelete(id: string) {
    setError(null);
    startTransition(async () => {
      updateOptimistic({ type: "delete", id });
      const result = await deleteBlogPost(id);
      if (!result.success) setError(result.error);
    });
  }

  return (
    <div className={isPending ? "opacity-80 transition-opacity" : ""}>
      <PageHeader title="Blog" description="Create and manage blog posts.">
        <Link href="/dashboard/blog/new" className={cn(buttonVariants())}>
          <Plus className="h-4 w-4" aria-hidden />
          New Post
        </Link>
      </PageHeader>

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      <div className="mt-8 space-y-4">
        {optimisticPosts.length === 0 ? (
          <EmptyState
            title="No blog posts yet"
            description="Create your first post to get started."
          />
        ) : (
          optimisticPosts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    /blog/{post.slug} ·{" "}
                    {post.published_at ? formatDate(post.published_at) : "Draft"}
                    {post.reading_time ? ` · ${post.reading_time} min` : ""}
                  </p>
                  {post.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs capitalize">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={post.published}
                      label={`Toggle publish for ${post.title}`}
                      disabled={isPending}
                      onCheckedChange={(v) => handleToggle(post.id, v)}
                    />
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                  <Link
                    href={`/dashboard/blog/${post.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                    aria-label={`Edit ${post.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <ConfirmDeleteButton
                    onConfirm={() => handleDelete(post.id)}
                    disabled={isPending}
                  />
                </div>
              </CardHeader>
              {post.excerpt && (
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
