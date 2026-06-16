# Blog System Architecture

## Database (`supabase/schema.sql`)

### `blog_posts`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Primary key |
| `author_id` | UUID | FK → `profiles` |
| `title`, `slug` | TEXT | Display + URL (`slug` unique) |
| `excerpt`, `content` | TEXT | Listing summary + Markdown body |
| `cover_image` | TEXT | Public URL (Supabase Storage) |
| `tags` | TEXT[] | Tag filter + related posts |
| `meta_title`, `meta_description`, `og_image` | TEXT | SEO overrides |
| `published`, `published_at` | BOOL + TIMESTAMPTZ | Draft vs live |
| `reading_time` | INT | Minutes (computed on save) |

**Indexes:** `slug`, `published`, GIN full-text on `title + excerpt + content`.

**Storage:** `blog-covers` bucket (public read, admin write).

## API Architecture

Server Actions (`src/lib/actions/admin/blog.ts`) — admin-only via `assertAdmin()`:

| Action | Description |
|--------|-------------|
| `createBlogPost` | Insert with slug, reading time, SEO fields |
| `updateBlogPost` | Update all fields; preserves `published_at` when re-publishing |
| `toggleBlogPublished` | Quick publish / unpublish |
| `deleteBlogPost` | Hard delete + path revalidation |
| `uploadBlogCover` | Upload to `blog-covers` bucket |

CMS queries (`src/lib/cms/queries.ts`, `src/lib/cms/blog.ts`):

| Function | Scope |
|----------|-------|
| `getBlogPosts(publishedOnly?)` | List for public or dashboard |
| `getBlogPostBySlug` | Detail page |
| `getBlogPostById` | Dashboard editor |
| `getRelatedBlogPosts` | Tag overlap scoring |
| `searchBlogPosts` | Client-side filter (title, excerpt, content, tags) |

## Search Strategy

1. **Primary:** In-memory filter via `filterPostsClient()` on fetched posts — works with seed fallback and avoids FTS config drift.
2. **Database (optional upgrade):** GIN index on `to_tsvector('english', title || excerpt || content)` for server-side `textSearch` when post volume grows.
3. **Tags:** Array `contains` filter in Supabase or client `tags.includes()`.

## Markdown Rendering

`src/components/blog/markdown-content.tsx`:

- **remark-gfm** — tables, task lists, strikethrough
- **rehype-slug** — heading IDs (synced with TOC via `github-slugger`)
- **rehype-highlight** — syntax highlighting (`highlight.js` github-dark theme)
- **Mermaid** — ` ```mermaid ` code blocks rendered client-side
- **Images** — Next.js `Image` with remote Supabase URLs

## SEO

- **Per-post:** `meta_title`, `meta_description`, `og_image` (fallback: title, excerpt, cover)
- **`createMetadata()`** — canonical URL, Open Graph, Twitter cards
- **Article OG** — `type: article`, `publishedTime`, `modifiedTime`, `tags`
- **JSON-LD** — `BlogPosting` schema in `article-json-ld.tsx`

## Routes

| Route | Type |
|-------|------|
| `/blog` | Public listing + search/tags |
| `/blog/[slug]` | Public detail (TOC, related) |
| `/dashboard/blog` | Admin list |
| `/dashboard/blog/new` | Create |
| `/dashboard/blog/[id]` | Edit |

## Setup

1. Run `supabase/schema.sql` in Supabase SQL Editor (or `blog-upgrade.sql` on existing DB).
2. Ensure `blog-covers` storage bucket exists (included in schema).
3. Set `NEXT_PUBLIC_SITE_URL` for canonical URLs and JSON-LD.
