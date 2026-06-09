# GEO Website Content Audit

Date: 2026-06-09
Scope: `docs/articles` -> `src/content/docs` -> `dist` -> routing, linking, discovery, and publish strategy

## Executive Summary

The core 100-page content system is present and builds successfully, but the website is not operating as a coherent GEO role-model yet. The content architecture defined in `docs/articles/SITEMAP.md` is complete and matches the built `dist` output, but the public discovery layer is inconsistent:

- the live content graph uses root-level routes like `/geo-fundamentals/...`
- the manual `/docs` and `/sitemap` surfaces still point at an older `/docs/...` route model
- the build ships a second, legacy documentation layer that conflicts with the main content corpus
- critical GEO signals recommended by the content itself are not implemented on the site: no `robots.txt`, no `llms.txt`, no `sitemap.xml`, no canonical URLs, no JSON-LD, no author metadata, and no publication metadata

The result is a site that has strong topical coverage but weak crawl clarity, weak trust signals, and a fragmented website structure. For a site intended to model GEO best practice, the biggest gap is not content quantity. It is operational coherence.

## Status Update

Update after the initial audit:

- the primary navigation intent has been revised to `GEO` | `SEO` | `Tutorials` | `Contact`
- `Tutorials` is now the preferred label for the user-facing knowledge index, replacing `Documentation` as the main IA term
- the footer intent has also been revised:
  - `Solutions`: `China GEO`, `GEO Audit`, `SEO Audit`
  - `Resources`: `Tutorials`, `Case Studies`, `Blog`, `Sitemap`
  - `Company`: `About`, `Contact`
  - `Legal`: unchanged

This improves naming clarity and better supports a tutorial-oriented knowledge experience. The remaining audit findings still apply where they relate to sitemap generation, crawler guidance, metadata, legacy routes, and publish strategy.

## Audit Method

I audited four layers:

1. Planned source structure in `docs/articles`
2. Build source structure in `src/content/docs`
3. Generated output in `dist`
4. Discovery and publish surfaces in Astro pages, layouts, and deployment config

I also checked:

- content inventory parity
- URL parity against `docs/articles/SITEMAP.md`
- internal markdown link integrity
- site-shell route integrity
- metadata and technical discovery coverage
- deployment setup

## Inventory Snapshot

### Content counts

- `docs/articles`: 101 Markdown files
- `src/content/docs`: 100 Markdown files
- `dist`: 105 HTML files

Interpretation:

- `docs/articles/SITEMAP.md` is the only source file not copied into `src/content/docs`
- the 100 planned content pages are all present in `src/content/docs`
- the 105 built HTML files are: 100 live content pages + 5 non-content pages or legacy pages

### Planned vs actual URL coverage

The content plan is structurally complete:

- planned URLs in `docs/articles/SITEMAP.md`: 100
- URLs present in `src/content/docs`: 100
- planned URLs missing from `src/content/docs`: 0
- planned URLs missing from `dist`: 0
- extra content URLs in `src/content/docs` not in the plan: 0

Conclusion: the planned 100-page topology is intact from planning through build.

## Key Findings

### 1. The public website structure is split between the live cluster model and a stale legacy docs model

Severity: Critical

The real content site uses this URL architecture:

- `/geo-fundamentals/`
- `/china-ai-ecosystem/`
- `/world-to-china-geo/`
- `/china-to-world-geo/`
- nested spoke and detail routes underneath those

That structure is defined in:

- `docs/articles/SITEMAP.md`
- frontmatter `url` fields in `src/content/docs/**`
- `src/pages/[...slug].astro`

But several user-facing surfaces still point to an older `/docs/...` route model:

- `src/pages/docs/index.astro`
- `src/pages/sitemap.astro`
- legacy static pages under `src/pages/docs/fundamentals/*`
- `src/layouts/DocsLayout.astro` navigation

Impact:

- users encounter two competing information architectures
- crawlers see a content-rich root route system plus a stale docs route system
- authority gets diluted across conflicting hub pages
- `/docs` does not act as a useful index for the actual 100-page system

Evidence:

- `src/pages/sitemap.astro` links to `/docs/fundamentals/...`, `/docs/strategies/...`, and `/docs/advanced/...`
- the actual content pages are built at root-level cluster routes
- `dist/docs/fundamentals/what-is-geo/index.html` and `dist/docs/fundamentals/history-of-geo/index.html` are legacy pages, not part of the 100-page architecture

### 2. `/sitemap` is not a sitemap in either SEO or GEO terms

Severity: Critical

The current `/sitemap` page is an HTML page, not a machine-readable sitemap. Worse, it links to stale and non-existent routes.

Broken links from `src/pages/sitemap.astro`:

- `/docs/fundamentals/geo-vs-seo`
- `/docs/fundamentals/how-generative-engines-work`
- `/docs/strategies/core-geo-strategies`
- `/docs/strategies/e-e-a-t-optimization`
- `/docs/strategies/content-structuring`
- `/docs/strategies/citation-optimization`
- `/docs/advanced/measurement`
- `/docs/advanced/tools`
- `/docs/advanced/case-studies`

Impact:

- users and crawlers are sent to non-existent pages
- there is no `sitemap.xml`
- the site fails basic crawl-discovery expectations
- this directly contradicts the technical GEO guidance published in the content

### 3. The site does not implement the core discovery artifacts it recommends

Severity: Critical

Absent at both source and built output:

- `public/robots.txt`: missing
- `public/llms.txt`: missing
- `dist/robots.txt`: missing
- `dist/llms.txt`: missing
- `dist/sitemap.xml`: missing

Impact:

- no explicit crawler policy
- no explicit AI crawler guidance
- no machine-readable URL inventory
- the site talks about these standards but does not embody them

For a GEO role-model, this is one of the highest-priority gaps.

### 4. The 100 live content pages ship with almost no metadata enrichment

Severity: High

Frontmatter coverage across `src/content/docs`:

- `excerpt`: 0/100
- `description`: 0/100
- `pubDate`: 0/100
- `image`: 0/100
- `featured`: 0/100
- `readTime`: 0/100

Layout behavior:

- `src/layouts/DocsLayout.astro` only emits `<meta name="description">` if `description` is present
- since all 100 live content entries lack `description` and `excerpt`, the content pages ship without descriptions
- there is no canonical tag
- there are no Open Graph tags
- there are no Twitter tags
- there is no `application/ld+json` schema output

Impact:

- weak snippet quality in search and social sharing
- no machine-readable authorship or publishing context
- no article-level schema for AI and search systems
- the website does not expose the trust markers the content itself advocates

### 5. The site has no author, publisher, or publication-date layer despite presenting itself as an authority resource

Severity: High

The content strongly advocates:

- expert authorship
- `author`
- `datePublished`
- `publisher`
- `Person` and `Organization` schema

But the implementation does not expose those signals on-page or in metadata.

Observed issues:

- no author frontmatter fields in the live content corpus
- no author bio pages
- no article dates
- no organization schema
- no author schema

Impact:

- weaker E-E-A-T signals
- weaker extractability for AI retrieval and citation
- reduced trust compared with what a GEO showcase site should demonstrate

### 6. The content graph is mostly healthy, but it has one broken content link and three orphan detail pages

Severity: High

Internal markdown link audit across `src/content/docs`:

- live content pages: 100
- internal markdown links: 1,037
- broken content links: 1
- orphan content pages: 3

Broken content link:

- from `src/content/docs/pillars/P3-world-to-china-geo.md`
- broken URL: `/world-to-world/technical-seo-baidu/`
- expected URL: `/world-to-china/technical-seo-baidu/`

Orphan pages in the content graph:

- `/geo-fundamentals/geo-vs-seo/keywords-vs-entities/`
- `/geo-fundamentals/geo-vs-seo/rankings-vs-citations/`
- `/geo-fundamentals/geo-vs-seo/seo-geo-synergy/`

Cause:

- `src/content/docs/spokes/S1-2-geo-vs-seo.md` does not link to its three detail pages in the related-articles section

Impact:

- weak local cluster reinforcement
- detail pages depend on direct URL access or external discovery
- missed opportunity for topic depth and crawler traversal

### 7. `docs/articles` and `src/content/docs` are identical duplicated corpora

Severity: Medium

Audit result:

- 100 article files in `docs/articles` match 100 article files in `src/content/docs`
- file content differences: 0
- `SITEMAP.md` exists only in `docs/articles`

This means the project currently maintains two sources of truth:

- editorial source in `docs/articles`
- build source in `src/content/docs`

Even though they match today, this is a drift risk. Any future update can silently desynchronize planning, content editing, and build output.

Impact:

- editorial overhead
- drift risk
- no single canonical content source

### 8. The homepage is stronger than the docs hub, but discovery is still incomplete

Severity: Medium

Positive:

- the homepage is data-driven from the content collection
- it links into pillars and spokes dynamically
- this makes the homepage more aligned with the actual content graph than `/docs` or `/sitemap`
- the nav/footer IA has since been revised to a cleaner public vocabulary, with `Tutorials` replacing `Documentation` as the primary knowledge label

Limitations:

- some nav and footer items may still use placeholders until their target pages are created
- there is no dedicated live cluster hub or all-content index driven from the collection
- detail pages are not surfaced systematically outside article-body linking

Impact:

- the homepage works as a showcase, not as a durable knowledge hub
- discovery paths remain uneven

### 9. The content quality is broad and topical, but citation scaffolding is thin

Severity: Medium

Content corpus observations:

- 100 pages cover a coherent GEO topic-cluster architecture
- the internal linking density is good
- only 8 of 100 pages contain external URLs
- no footnote-style citation framework is present

Impact:

- the site explains evidence-based authority, but much of the content does not visibly practice it
- for a GEO showcase, stronger sourcing would improve trust, extractability, and defensibility

### 10. Publish strategy is minimal and likely a source of the “pages not showing” issue

Severity: Medium

Observed deployment setup:

- `wrangler.toml` points Cloudflare Pages to `dist`
- `package.json` has `build`, `dev`, and `preview`, but no `deploy` script
- there is no CI pipeline in the repo
- `astro.config.mjs` still uses `site: 'https://geo.example.com'`

Impact:

- build output can exist locally without a reliable publish path
- missing or wrong domain configuration will break future absolute URLs, canonical tags, and sitemap generation
- no automated validation exists before publish

This supports the earlier symptom that pages may exist in `dist` but not actually be live on the site.

## GEO Readiness Assessment

### What is already strong

- clear 4-pillar / 24-spoke / 72-detail topic cluster architecture
- complete URL plan carried through source and build
- dense internal content linking
- static output well-suited to fast delivery
- homepage uses live collection data rather than hardcoded article inventory

### What prevents role-model GEO status today

- no crawler guidance files
- no machine-readable sitemap
- stale route surfaces
- no structured data implementation
- no author or date signals
- no canonicalization strategy
- no content governance single source of truth
- no deployment automation or validation

## Prioritized Solutions

### Phase 1: Fix route coherence and discovery immediately

Priority: P0

1. Remove the legacy docs architecture from the public site.
2. Replace `src/pages/sitemap.astro` with a generated index based on the live collection.
3. Add a real `sitemap.xml` generated from the content collection.
4. Either remove `/docs` or convert it into a live index of pillars, spokes, and details using `getCollection('docs')`, while keeping `Tutorials` as the public-facing label.
5. Remove or redirect legacy static pages under `src/pages/docs/fundamentals/*`.

Expected outcome:

- one coherent URL model
- no stale route references
- stronger crawl clarity

### Phase 2: Implement the technical GEO layer the site teaches

Priority: P0

1. Add `public/robots.txt`.
2. Add `public/llms.txt`.
3. Generate `sitemap.xml` at build time.
4. Set the real production domain in `astro.config.mjs`.
5. Emit canonical URLs on every page.

Expected outcome:

- crawler access becomes explicit
- AI and search systems get a clean discovery layer
- the site begins practicing its own technical guidance

### Phase 3: Add article metadata and schema

Priority: P0

Add frontmatter fields across `src/content/docs`:

- `description`
- `excerpt`
- `pubDate`
- `updatedDate`
- `author`
- `image`
- `readTime`

Emit in layouts:

- meta description
- canonical
- Open Graph
- Twitter card
- `Article` JSON-LD for content pages
- `Organization` JSON-LD sitewide
- `Person` JSON-LD for author pages

Expected outcome:

- stronger E-E-A-T
- better snippet quality
- better AI extractability

### Phase 4: Repair the internal content graph

Priority: P1

1. Fix the typo in `P3-world-to-china-geo.md`:
   - `/world-to-world/technical-seo-baidu/` -> `/world-to-china/technical-seo-baidu/`
2. Add links from `S1-2-geo-vs-seo.md` to:
   - `/geo-fundamentals/geo-vs-seo/rankings-vs-citations/`
   - `/geo-fundamentals/geo-vs-seo/keywords-vs-entities/`
   - `/geo-fundamentals/geo-vs-seo/seo-geo-synergy/`
3. Consider automatic related-content generation based on `parent_pillar`, `parent_spoke`, and cluster.

Expected outcome:

- no broken internal links
- no orphan detail pages
- stronger topic-cluster traversal

### Phase 5: Remove content governance duplication

Priority: P1

Choose one source of truth:

Option A:

- make `src/content/docs` the only canonical source
- move planning documents to a separate non-content folder

Option B:

- keep `docs/articles` as editorial source
- generate or sync `src/content/docs` automatically in build or prebuild

Recommendation:

- prefer Option A unless there is a strict editorial workflow reason to preserve both trees

Expected outcome:

- simpler maintenance
- less drift risk
- clearer authoring workflow

### Phase 6: Upgrade the publish strategy

Priority: P1

1. Add an explicit deploy script, for example `wrangler pages deploy dist`.
2. Add a validation step before deploy:
   - build
   - check internal links
   - check sitemap generation
   - check `robots.txt` and `llms.txt`
3. Add CI for build and validation.
4. Use preview deployments for content QA.

Expected outcome:

- fewer “works in dist but not live” failures
- repeatable publishing
- faster confidence on each content update

### Phase 7: Improve role-model GEO content credibility

Priority: P2

1. Introduce visible author bylines and expert bios.
2. Add publication and update dates.
3. Add source sections or footnotes to pages that make factual claims.
4. Add a methodology or editorial standards page.
5. Add organization and contact trust signals beyond the current branding treatment.

Expected outcome:

- stronger trust posture
- better citation defensibility
- closer alignment between the site’s message and its implementation

## Recommended Implementation Order

Week 1:

- remove stale docs routes
- replace `/sitemap`
- add `robots.txt`, `llms.txt`, `sitemap.xml`
- set the real site domain

Week 2:

- add metadata frontmatter
- add canonical, OG, Twitter, and JSON-LD
- fix the broken link and orphaned detail links

Week 3:

- consolidate content source of truth
- add automated validation and deploy workflow
- strengthen citation and authorship presentation

## Bottom Line

This project already has the hardest part of a GEO knowledge hub: a complete, coherent 100-page topic cluster architecture. The failure is not the content plan. The failure is the website layer around it.

If the site is meant to be a role model for GEO practice, the next step is not writing more pages. It is making the site structurally honest:

- one route model
- one source of truth
- one crawl-discovery system
- one metadata strategy
- one publish pipeline

Once those are in place, the existing content base becomes much more credible as both a user-facing knowledge system and a GEO demonstration property.
