import { BlogManager } from "@/components/dashboard/blog-manager";
import { getBlogPosts } from "@/lib/cms/queries";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Blog Management",
  noIndex: true,
});

export default async function BlogManagementPage() {
  await requireAdmin();
  const posts = await getBlogPosts(false);

  return <BlogManager initialPosts={posts} />;
}
