import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/dashboard/blog-post-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getBlogPostById } from "@/lib/cms/blog";
import { createMetadata } from "@/lib/seo";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  return createMetadata({
    title: post ? `Edit: ${post.title}` : "Edit Post",
    noIndex: true,
  });
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  await requireAdmin();
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit Post" description={post.title} />
      <div className="mt-6">
        <BlogPostForm post={post} />
      </div>
    </div>
  );
}
