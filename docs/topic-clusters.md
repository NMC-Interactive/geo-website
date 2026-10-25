# Topic Clusters — GEO Visibility Guide

> Cluster plan for the Dual-Track GEO architecture (World-to-China / China-to-World).
> Status: implemented and live. This document records the inventory, the linking model,
> the gap analysis, and the backlog of suggested new pages.

## Inventory

The site is organized as 4 pillar clusters, each with 6 spokes and 3 detail pages per
spoke — **100 content pages** total. The full URL-to-file mapping lives in
`docs/articles/SITEMAP.md` (kept in parity with the build by `npm run validate:site`).

| Pillar | Cluster | URL | Spokes | Details |
|---|---|---|---|---|
| P1 | GEO Fundamentals | `/geo-fundamentals/` | S1-1 … S1-6 | 18 |
| P2 | China AI Ecosystem | `/china-ai-ecosystem/` | S2-1 … S2-6 | 18 |
| P3 | World-to-China | `/world-to-china-geo/` | S3-1 … S3-6 | 18 |
| P4 | China-to-World | `/china-to-world-geo/` | S4-1 … S4-6 | 18 |

### Cluster definitions

1. **GEO Fundamentals** — what GEO is, how it differs from SEO, KPI measurement,
   structured data, entity authority, technical foundations. The entry cluster for every
   other track.
2. **China AI Ecosystem** — the China AI "Big Six" platforms (Baidu Ernie Bot, DeepSeek,
   Doubao, Qwen, Kimi) plus the AI regulatory environment. Note: **Tencent Yuanbao is
   missing** — see gap G1.
3. **World-to-China** — inbound track: ICP licensing, content localization, Baidu
   Baike/Zhihu authority, WeChat B2B, Baidu technical SEO, cultural nuance. Serves
   non-Chinese brands entering the Chinese AI discovery surface.
4. **China-to-World** — outbound track: English content strategy, LinkedIn, international
   PR, Google Gemini/AI Overviews, thought leadership, case studies of Chinese brands
   going global.

The two track clusters (P3, P4) are the Dual-Track theme; P1 and P2 are the shared
foundation both tracks draw on.

## Internal-linking model (implemented)

Every page participates in the cluster graph automatically at build time:

- **Hub sections** — pillar pages render "Spokes In This Guide" listing every spoke with
  its detail pages; spoke pages render "Detail Articles In This Guide". This makes each
  pillar a real hub page and each spoke a mini-hub.
- **Breadcrumbs** — full chain `Home → Pillar → Spoke → Detail`, clickable at every hop,
  mirrored in `BreadcrumbList` JSON-LD.
- **Related links** — up to 4 related tutorials per page, scored by cluster membership and
  parent/child relationships.
- **Cross-pillar bridges** — pillar frontmatter carries `related_pillars`; pillar
  prefaces link to the other three pillars. P3/P4 content cross-references P1/P2.
- **Machine indexes** — `/llms.txt` (curated: pillars + spokes) and `/llms-full.txt`
  (complete: all 100 pages) are sectioned per cluster, so AI crawlers ingest the cluster
  structure directly.

## Gap analysis & suggested new pages (backlog)

None of these require changing existing pages; each is a new-page suggestion. Item IDs
match `memory/backlog.yaml`.

| ID | Page(s) | Cluster | Why |
|---|---|---|---|
| G1 | S2-7 Yuanbao (Tencent) spoke + 3 details | P2 | Completes the China AI "Big Six" — Yuanbao is the only Big Six platform without a spoke. Details: WeChat/QQ synergy, Yuanbao API & Tencent Cloud, Yuanbao content ecosystem. |
| G2 | `/zh/` Chinese variants of P1–P4 with `hreflang` | all | The site is EN-only; a China-facing GEO site should have zh landing pages at minimum (full zh translation is a larger project — start with pillars). |
| G3 | About / editorial standards page | utility | E-E-A-T anchor: Person schema for the author, Organization publisher, editorial policy. Currently the author bio only lives inside article pages. |
| G4 | GEO measurement tools guide (Profound, Peec AI, Brand2Q, …) | P1 (detail under S1-3) | Citation Rate / Share of Model are defined but tooling is not covered. |
| G5 | Second-tier Chinese AI engines (iFlytek Spark, Huawei Pangu, Xiaomi) | P2 (detail set under S2) | Big Six coverage exists; challenger engines are unanswered queries. |
| G6 | Homepage server-rendered hero text | utility | Homepage content is a client-only React island — crawlers that don't execute JS see no hero copy. Add SSR text (visible, not hidden). |
| G7 | Case-study expansion: Anker, DJI, SHEIN teardowns | P4 (details under S4-6) | Only Haier, BYD, TikTok exist; more global-teardown data strengthens citation-worthiness. |
| G8 | Video GEO: Douyin/TikTok + YouTube AI discovery | P3/P4 bridge detail | Video is the fastest-growing AI citation surface and is untouched. |
| G9 | Editorial date policy | process | `pubDate`/`updatedDate` are currently git-derived (`scripts/backfill-dates.mjs`); editors should set `updatedDate` manually on substantive content updates. |
| G10 | Baidu + Sogou + 360 webmaster verification files | technical | GSC verification exists (`public/google26ab30f9c3675e91.html`); Chinese engines are not verified yet. |

## Sitemap & llms.txt reflection

- `sitemap.xml` lists utility pages first, then every URL grouped pillar → spokes →
  details, with `<lastmod>` from frontmatter dates.
- The human `/sitemap/` page renders the same cluster grouping plus a
  machine-readable indexes block (`llms.txt`, `llms-full.txt`, `robots.txt`).
- `llms.txt` / `llms-full.txt` sections mirror the 4 clusters exactly.

## Parity rule

When page inventory changes: update `docs/articles/SITEMAP.md`, then run
`npm run validate:site` — the parity check fails the build if content frontmatter and
SITEMAP.md drift.
