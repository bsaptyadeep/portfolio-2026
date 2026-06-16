import type { BlogPost } from "@/types/database";
import { siteConfig } from "@/lib/seo";

interface ArticleJsonLdProps {
  post: BlogPost;
}

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const url = `${siteConfig.url}/blog/${post.slug}`;
  const image = post.og_image ?? post.cover_image ?? `${siteConfig.url}${siteConfig.ogImage}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt,
    image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
