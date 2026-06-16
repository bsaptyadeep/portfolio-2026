import { BlogPostForm } from "@/components/dashboard/blog-post-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "New Blog Post",
  noIndex: true,
});

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <div>
      <PageHeader title="New Post" description="Write and publish a new article." />
      <div className="mt-6">
        <BlogPostForm />
      </div>
    </div>
  );
}
