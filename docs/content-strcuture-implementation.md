# GEO Content Structure Implementation Plan

Date: 2026-06-09
Source inputs:
- `docs/content-audit-report.md`
- `docs/articles/SITEMAP.md`
- `docs/master-layout-design.pen`

## Purpose

This document converts the audit findings and renewed Pencil designs into an implementation plan for the live Astro site. The goal is to make the website structurally consistent with its 100-page content architecture and credible as a role-model GEO property.

This plan assumes the renewed Pencil file is now the design reference for:

- public navigation
- footer information architecture
- HTML sitemap experience
- GEO article-page trust and extractability layer

## Target State

The live site should operate as one coherent system:

- one public route model
- one content source of truth
- one Tutorials index / sitemap experience
- one article metadata strategy
- one author identity model
- one publish and validation workflow

## Design-to-Build Reference

### 1. Global navigation

Pencil intent:
- `GEO`
- `SEO`
- `Tutorials`
- `Contact`

Implementation intent:
- keep this nav across homepage, article pages, and sitemap/tutorial pages
- avoid reintroducing `Documentation` in public UI
- use `Tutorials` as the main knowledge label

Primary files:
- `src/components/sections/Navigation.tsx`
- `src/layouts/DocsLayout.astro`
- `src/pages/sitemap.astro`

### 2. Footer structure

Pencil intent:
- `Solutions`: `China GEO`, `GEO Audit`, `SEO Audit`
- `Resources`: `Tutorials`, `Case Studies`, `Blog`, `Sitemap`
- `Company`: `About`, `Contact`
- `Legal`: unchanged

Implementation intent:
- preserve the renewed footer labels
- allow placeholder links only where no destination exists yet
- eventually replace placeholders with live pages

Primary files:
- `src/components/sections/FooterSection.tsx`
- `src/contexts/LanguageContext.tsx`

### 3. HTML sitemap page

Pencil frame:
- `b6Rkp` `HTML Sitemap Page`

Implementation intent:
- replace the current stale `/sitemap` experience with a generated Tutorials index
- group links by actual pillar/spoke/detail structure
- separate live routes from legacy or redirect candidates
- keep the page crawlable, human-readable, and aligned with the content plan in `docs/articles/SITEMAP.md`

Primary files:
- `src/pages/sitemap.astro`
- `src/pages/docs/index.astro` or its replacement/removal

### 4. GEO article template

Pencil frame:
- `gRKtA` `Content / Article Page`

The renewed article template now includes:
- article byline and updated date
- GEO trust panel
- answer-ready summary panel
- canonical and provenance panel
- primary sources section
- entity coverage section
- author standard section
- author social links
- FAQ readiness section
- publisher/contact trust strip
- related tutorials section

Implementation intent:
- turn this into the live article shell for collection-based content pages
- do not treat these as decorative blocks; each one should map to real content data or generated metadata

Primary files:
- `src/layouts/DocsLayout.astro`
- `src/pages/[...slug].astro`
- `src/content.config.ts`
- `src/data/bio.json`

## Core Implementation Decisions

### Decision 1: Keep root-level cluster URLs as canonical

Canonical route families remain:
- `/geo-fundamentals/...`
- `/china-ai-ecosystem/...`
- `/world-to-china/...`
- `/world-to-china-geo/`
- `/china-to-world/...`
- `/china-to-world-geo/`

Actions:
- remove or redirect stale `/docs/...` public surfaces
- ensure `/sitemap` and `Tutorials` only reference the root-level live content routes

### Decision 2: Use `src/content/docs` as the canonical content source

Recommendation from audit remains valid:
- `src/content/docs` should become the only live content source
- `docs/articles` remains planning/editorial documentation, not a duplicated publish source

Actions:
- stop treating the two trees as co-equal content stores
- keep `docs/articles/SITEMAP.md` as planning/reference until a more formal editorial system exists

### Decision 3: Add a structured author model

Current plan:
- use `src/data/bio.json` as the first reusable author source
- start with `River Ho` as the visible named author identity

Actions:
- connect article frontmatter `author` to entries in `src/data/bio.json`
- use the same source for on-page author blocks and JSON-LD `Person`

## Implementation Workstreams

## Workstream A: Route coherence and Tutorials system

Objective:
- eliminate route ambiguity and make Tutorials the real content index

Tasks:
1. Replace `src/pages/sitemap.astro` with a generated Tutorials page based on `getCollection('docs')`.
2. Group entries by pillar, then spoke, then detail.
3. Surface the four pillar pages prominently near the top.
4. Decide whether `/docs` should:
   - redirect to `/sitemap`, or
   - become a lightweight alias page using the same generated dataset.
5. Remove or redirect legacy static files under `src/pages/docs/fundamentals/*`.

Output:
- one coherent human sitemap / Tutorials experience
- no stale links to `/docs/...`

## Workstream B: Article data model

Objective:
- support the GEO article template with real structured data

Add or normalize these frontmatter fields across `src/content/docs`:
- `title`
- `url`
- `cluster`
- `description`
- `excerpt`
- `pubDate`
- `updatedDate`
- `author`
- `readTime`
- `image`
- `tags`
- `entities`
- `sources`
- `faq`

Suggested field purpose:
- `description`: meta description
- `excerpt`: on-page summary / cards / feeds
- `author`: key into `src/data/bio.json`
- `entities`: powers the entity coverage section
- `sources`: powers the sources section
- `faq`: powers FAQ UI and FAQ schema

Primary files:
- `src/content.config.ts`
- `src/content/docs/**/*`

## Workstream C: Live article template implementation

Objective:
- implement the renewed Pencil article page in Astro

Implement these sections in `DocsLayout.astro` or adjacent components:

1. Header block
- breadcrumb/cluster marker
- article title
- updated date
- read time
- byline

2. GEO trust panel
- visible trust chips
- values should come from article data and site defaults

3. Answer-ready summary panel
- use `excerpt` or a dedicated summary field
- keep it direct and extractable

4. Canonical and provenance panel
- canonical URL
- published date
- updated date
- schema type

5. Primary sources section
- render from structured `sources`

6. Entity coverage section
- render from `entities`

7. Author standard section
- author name from `bio.json`
- author bio
- social profiles
- review cadence and trust signals

8. FAQ readiness section
- render from `faq`
- later expose as `FAQPage` JSON-LD where appropriate

9. Publisher/contact strip
- publisher identity
- editorial standards page link
- corrections/contact pathway

10. Related tutorials
- generated from cluster and parent relationships

Implementation note:
- move repeated blocks into small Astro components once the shape stabilizes

## Workstream D: Metadata and schema

Objective:
- make the live site practice the GEO guidance it teaches

Implement sitewide:
- canonical tags
- meta description fallback logic
- Open Graph tags
- Twitter tags
- `Organization` JSON-LD

Implement article-level:
- `Article` JSON-LD
- `Person` JSON-LD for author references
- `FAQPage` JSON-LD where FAQ exists
- image, dates, author, canonical, and publisher references

Primary files:
- `src/layouts/DocsLayout.astro`
- `src/layouts/Layout.astro`
- `astro.config.mjs`

## Workstream E: Technical discovery layer

Objective:
- add the missing machine-readable GEO/SEO discovery artifacts

Tasks:
1. Add `public/robots.txt`.
2. Add `public/llms.txt`.
3. Generate `sitemap.xml` from the live content collection and key utility pages.
4. Set the real production `site` URL in `astro.config.mjs`.

Rules:
- `sitemap.xml` must reflect only live canonical routes
- no legacy `/docs/...` URLs unless intentionally redirected and documented

## Workstream F: Internal content graph repair

Objective:
- remove broken traversal and orphaning

Tasks from audit:
1. Fix the typo in `P3-world-to-china-geo.md`:
   - `/world-to-world/technical-seo-baidu/`
   - to `/world-to-china/technical-seo-baidu/`
2. Add missing detail links to `S1-2-geo-vs-seo.md`:
   - `/geo-fundamentals/geo-vs-seo/rankings-vs-citations/`
   - `/geo-fundamentals/geo-vs-seo/keywords-vs-entities/`
   - `/geo-fundamentals/geo-vs-seo/seo-geo-synergy/`
3. Add generated related-content logic where possible.

## Workstream G: Publish strategy and validation

Objective:
- prevent “built in dist but not live” regressions

Tasks:
1. Add explicit deploy commands.
2. Add a validation script that checks:
   - build success
   - sitemap generation
   - `robots.txt`
   - `llms.txt`
   - link integrity
   - metadata presence on content pages
3. Add preview QA before publish.
4. Add CI for build and validation.

Primary files:
- `package.json`
- deployment config
- CI workflow files

## Page and Component Plan

### Pages

Implement or revise:
- `src/pages/index.astro`
- `src/pages/sitemap.astro`
- `src/pages/[...slug].astro`
- `src/pages/docs/index.astro` or replace/remove

Future placeholder pages to add when ready:
- `/about/`
- `/contact/`
- `/blog/`
- `/case-studies/` if broader than current article-level case-study content
- `/editorial-standards/`

### Data and config

Implement or revise:
- `src/content.config.ts`
- `src/data/bio.json`
- `src/types/articles.ts`

### Layouts/components

Implement or revise:
- `src/layouts/DocsLayout.astro`
- `src/layouts/Layout.astro`
- `src/components/sections/Navigation.tsx`
- `src/components/sections/FooterSection.tsx`
- `src/contexts/LanguageContext.tsx`

## Delivery Phases

### Phase 1

Priority: P0

Deliver:
- generated `/sitemap` Tutorials page
- removal or redirection of stale `/docs` routes
- `robots.txt`
- `llms.txt`
- generated `sitemap.xml`
- real production domain in config

Success criteria:
- no stale `/docs/...` links in public UI
- one canonical discovery layer

### Phase 2

Priority: P0

Deliver:
- expanded content schema
- canonical/meta/OG/Twitter
- `Article` and `Organization` JSON-LD
- first live implementation of the renewed article template shell

Success criteria:
- article pages expose visible and machine-readable authorship, date, and canonical signals

### Phase 3

Priority: P1

Deliver:
- fix broken/orphan links
- generated related tutorials logic
- author system wired to `bio.json`
- social links and publisher/contact layer on articles

Success criteria:
- no broken internal links
- no orphan key detail pages

### Phase 4

Priority: P1

Deliver:
- content source-of-truth cleanup
- validation scripts
- deploy workflow

Success criteria:
- repeatable publishing with preflight checks

### Phase 5

Priority: P2

Deliver:
- editorial standards page
- About and Contact pages
- fuller author pages if needed
- broader credibility layer across tutorial corpus

Success criteria:
- the site presentation fully matches its GEO claims

## Recommended Build Order

1. Implement the Tutorials/sitemap route properly.
2. Add technical discovery artifacts.
3. Expand content schema and article metadata.
4. Build the renewed article template sections from Pencil.
5. Wire `bio.json` into article pages.
6. Repair content graph issues.
7. Add publish validation and deployment workflow.

## Acceptance Checklist

- `/sitemap` is generated from the live collection
- no public pages link to stale `/docs/...` routes
- every content page has canonical, description, author, publish/update date, and schema
- article pages visibly show author identity and trust signals
- `River Ho` author data is sourced from `src/data/bio.json`
- `robots.txt`, `llms.txt`, and `sitemap.xml` are present in build output
- footer and nav match the renewed Pencil IA
- related tutorials reinforce the cluster structure
- deploy workflow validates site integrity before publish

## Bottom Line

The renewed Pencil design gives the site a concrete target for how GEO should look in practice. The implementation priority is not more content creation. It is making the live Astro system faithfully express the existing content architecture, the renewed tutorial IA, and the new article-level trust layer.
