# Portfolio Architecture

## Folder Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public marketing site route group
│   │   │   ├── layout.tsx         # Header + Footer shell
│   │   │   ├── page.tsx           # Home
│   │   │   ├── about/
│   │   │   ├── experience/
│   │   │   ├── projects/
│   │   │   ├── blog/
│   │   │   │   └── [slug]/
│   │   │   └── contact/
│   │   ├── dashboard/             # Protected CMS routes
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── blog/
│   │   │   ├── experience/
│   │   │   ├── projects/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── login/
│   │   ├── layout.tsx             # Root: fonts, theme, auth providers
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── manifest.ts
│   ├── components/
│   │   ├── ui/                    # Shadcn-style primitives
│   │   ├── layout/                # Header, Footer, Sidebar
│   │   ├── cards/                 # Domain-specific card components
│   │   ├── motion/                # Framer Motion wrappers
│   │   └── providers/             # Theme + Auth context
│   ├── lib/
│   │   ├── supabase/              # Client, server, middleware helpers
│   │   ├── cms/                   # Data access layer (queries)
│   │   ├── actions/               # Server Actions (mutations)
│   │   ├── validations/           # Zod schemas
│   │   ├── data/                  # Seed/fallback data
│   │   ├── seo.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── database.ts            # Supabase-generated types
│   └── middleware.ts              # Auth gate for /dashboard
├── supabase/
│   └── schema.sql                 # Complete DB schema (run once)
└── .env.example
```

## Route Architecture

| Route | Type | Rendering | Purpose |
|-------|------|-----------|---------|
| `/` | Public | RSC | Hero, featured projects, latest posts |
| `/about` | Public | RSC | Bio, skills, approach |
| `/experience` | Public | RSC | Work history timeline |
| `/projects` | Public | RSC | Project grid |
| `/blog` | Public | RSC | Post listing |
| `/blog/[slug]` | Public | RSC + SSG | Markdown post detail |
| `/contact` | Public | RSC + Client form | Contact submission |
| `/login` | Auth | Client | Supabase password login |
| `/dashboard/*` | Protected | RSC | CMS management |

**Decision:** Route groups `(public)` isolate the marketing layout without affecting URLs. Dashboard lives outside the group with its own sidebar layout. Middleware protects `/dashboard/*` only — public pages stay fully static/cacheable.

## Database Schema

Six tables in Supabase PostgreSQL:

- **profiles** — 1:1 with `auth.users`, public-facing identity
- **blog_posts** — Markdown content, tags, publish state
- **projects** — Portfolio items with tech stack arrays
- **experiences** — Career timeline with highlights arrays
- **contact_messages** — Inbound form submissions
- **site_settings** — Key-value JSON for CMS config

RLS policies: public SELECT on published content; authenticated full CRUD for CMS tables; anonymous INSERT on contact_messages.

## Authentication Flow

1. User visits `/login` → email/password form
2. `supabase.auth.signInWithPassword()` sets HTTP-only cookies via `@supabase/ssr`
3. Middleware (`updateSession`) refreshes session on every `/dashboard` request
4. Unauthenticated `/dashboard` access redirects to `/login?redirect=...`
5. Authenticated `/login` access redirects to `/dashboard`
6. Sign out via Server Action clears session and redirects

**Decision:** Password auth (not magic link) for a single-admin CMS — simpler for portfolio owners. `@supabase/ssr` cookie-based sessions work with Next.js App Router server components.

## CMS Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Dashboard  │────▶│ Server       │────▶│  Supabase   │
│  (RSC/Form) │     │ Actions      │     │  PostgreSQL │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
┌─────────────┐     ┌──────────────┐           │
│  Public     │◀────│ lib/cms/     │◀──────────┘
│  Pages      │     │ queries.ts   │
└─────────────┘     └──────────────┘
```

- **Read path:** `lib/cms/queries.ts` — server-only data fetching with seed fallbacks
- **Write path:** `lib/actions/*` — Server Actions with Zod validation + `revalidatePath`
- **Content format:** Markdown stored in `blog_posts.content`, rendered via `react-markdown` + `remark-gfm`
- **Fallback:** Seed data in `lib/data/seed.ts` when Supabase env vars are absent (demo mode)

## State Management

| Concern | Approach | Why |
|---------|----------|-----|
| Server data | React Server Components + `queries.ts` | Zero client JS for content |
| Form state | `useActionState` + Server Actions | Progressive enhancement, no API routes |
| Theme | `next-themes` + CSS variables | System preference, no flash |
| Auth session | Supabase cookies + `AuthProvider` | SSR-compatible, minimal client state |
| UI state | Local `useState` (mobile nav, etc.) | No global store needed |

**Decision:** No Redux/Zustand. Portfolio CMS is read-heavy with infrequent writes — RSC + Server Actions eliminate client state complexity.

## Reusable Component Strategy

1. **ui/** — Atomic primitives (Button, Card, Input) — variant-driven via CVA
2. **layout/** — Shell components (Header, Footer, Sidebar) — composition roots
3. **cards/** — Domain cards (ProjectCard, BlogCard) — accept typed props from `types/database.ts`
4. **motion/** — FadeIn, StaggerContainer — consistent animation API, respects `prefers-reduced-motion`

**Decision:** Shadcn-style copy-paste components (not npm package) for full control. Domain cards separate from UI primitives to prevent coupling.

## Performance & SEO

- Static generation for blog slugs via `generateStaticParams`
- `sitemap.ts` + `robots.ts` + Open Graph metadata via `createMetadata()`
- Font `display: swap`, gradient mesh via CSS (no image assets)
- Glass effects limited to header/cards — `backdrop-blur` used sparingly
- Skip-to-content link, semantic HTML, ARIA labels on interactive elements
