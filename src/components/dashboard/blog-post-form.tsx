"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createBlogPost,
  updateBlogPost,
  uploadBlogCover,
} from "@/lib/actions/admin/blog";
import { generateSlug } from "@/lib/blog/utils";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/database";

interface BlogPostFormProps {
  post?: BlogPost;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEditing = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [coverImage, setCoverImage] = useState(post?.cover_image ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(generateSlug(value));
  }

  async function handleCoverUpload(file: File) {
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadBlogCover(formData);
    setIsUploading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setCoverImage(result.data.url);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("cover_image", coverImage);
    formData.set("published", String(published));
    if (!formData.get("slug")) formData.set("slug", slug || generateSlug(title));

    startTransition(async () => {
      const result = isEditing
        ? await updateBlogPost(post!.id, formData)
        : await createBlogPost(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/dashboard/blog");
      router.refresh();
    });
  }

  return (
    <div>
      <Link
        href="/dashboard/blog"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to posts
      </Link>

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      <form action={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Edit post" : "New post"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  placeholder="auto-generated-from-title"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                defaultValue={post?.excerpt ?? ""}
                placeholder="Short summary for listings and SEO"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                rows={16}
                defaultValue={post?.content ?? ""}
                required
                className="font-mono text-sm"
              />
              {isEditing && post?.reading_time && (
                <p className="text-xs text-muted-foreground">
                  ~{post.reading_time} min read (recalculated on save)
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={post?.tags.join(", ") ?? ""}
                placeholder="nextjs, react, architecture"
              />
              <p className="text-xs text-muted-foreground">Comma-separated</p>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={published}
                label="Publish post"
                onCheckedChange={setPublished}
              />
              <span className="text-sm text-muted-foreground">
                {published ? "Published" : "Draft"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cover image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {coverImage && (
              <div className="relative aspect-video max-w-md overflow-hidden rounded-xl border border-border/50">
                <Image
                  src={coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  unoptimized={coverImage.startsWith("http")}
                />
              </div>
            )}
            <input type="hidden" name="cover_image" value={coverImage} />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isUploading || isPending}
                onClick={() => fileRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ImagePlus className="h-4 w-4" aria-hidden />
                )}
                {isUploading ? "Uploading..." : "Upload cover"}
              </Button>
              {coverImage && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCoverImage("")}
                  disabled={isPending}
                >
                  Remove
                </Button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCoverUpload(file);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta title</Label>
              <Input
                id="meta_title"
                name="meta_title"
                defaultValue={post?.meta_title ?? ""}
                placeholder={title || "Defaults to post title"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta description</Label>
              <Textarea
                id="meta_description"
                name="meta_description"
                rows={2}
                maxLength={160}
                defaultValue={post?.meta_description ?? ""}
                placeholder="Max 160 characters"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="og_image">OG image URL</Label>
              <Input
                id="og_image"
                name="og_image"
                type="url"
                defaultValue={post?.og_image ?? ""}
                placeholder="Defaults to cover image"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending || isUploading}>
            {isPending ? "Saving..." : isEditing ? "Update post" : "Create post"}
          </Button>
          <Link href="/dashboard/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
