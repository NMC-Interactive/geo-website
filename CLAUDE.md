# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A 100+ page **GEO (Generative Engine Optimization)** intelligence website covering bidirectional GEO strategy between global and Chinese AI markets. The site is organized around a **Dual-Track** theme: World-to-China and China-to-World.

## Repository Layout

```
/                        ← Astro production project (canonical)
  src/
    pages/               ← File-based routing (.astro files)
    layouts/             ← Layout.astro (base), DocsLayout.astro (content)
    content/config.ts    ← Astro Content Collections schema
    styles/global.css
  astro.config.mjs
  tailwind.config.mjs
  package.json

source/app/              ← React/Vite design prototype (reference only)
  src/
    sections/            ← Page sections (Hero, Navigation, CoreThesis, etc.)
    contexts/            ← LanguageContext.tsx (bilingual EN/ZH)
    components/ui/       ← 40+ shadcn/ui components
  package.json

docs/                    ← Pre-written content (source of truth for copy)
  articles/
    pillars/             ← P1–P4 (4 pillar page markdown files)
    spokes/              ← S1-1 through S4-6 (24 spoke page markdown files)
    details/             ← D1-1-1 through D4-6-3 (72+ detail page markdown files)
    SITEMAP.md           ← Full URL map with linking structure
  report.md              ← Full research report / strategy brief
```

## Commands

All Astro commands run from the **project root**:

```bash
npm run dev        # Start Astro dev server
npm run build      # Production build
npm run preview    # Preview the production build
```

All React prototype commands run from `source/app/`:

```bash
npm run dev        # Vite dev server at http://localhost:3000
npm run build      # tsc -b && vite build
npm run lint       # ESLint
npm run preview    # Vite preview
```

## Astro Architecture

**Stack**: Astro 4.x + `@astrojs/tailwind` + Tailwind CSS 3.x

**Routing**: File-based under `src/pages/`. Current pages:
- `/` → `src/pages/index.astro`
- `/sitemap` → `src/pages/sitemap.astro`
- `/docs` → `src/pages/docs/index.astro`
- `/docs/fundamentals/what-is-geo` → `src/pages/docs/fundamentals/what-is-geo.astro`

**Layouts**:
- `Layout.astro` — base shell (head, body, slot)
- `DocsLayout.astro` — content pages with nav bar and constrained-width reading area

**Content Collections** (`src/content/config.ts`): The `docs` collection schema expects frontmatter with `title`, `url`, `detail?`, `parent_spoke?`, `cluster?`, `description?`, `pubDate?`.

**Design language**: Dark theme (`bg-[#050505]`, `text-white`), zinc-based border/muted palette, large tracking-tight headings (negative `tracking-[-2.5px]` style).

## Content Architecture (docs/)

The 100-page content hierarchy follows a strict topic-cluster model:

| Level | Count | Naming | Example |
|-------|-------|--------|---------|
| Pillar | 4 | `P{n}` | `P1-geo-fundamentals.md` |
| Spoke | 24 | `S{pillar}-{n}` | `S1-1-what-is-geo.md` |
| Detail | 72+ | `D{pillar}-{spoke}-{n}` | `D1-1-2-geo-definition-framework.md` |

**4 Pillars** (= 4 content clusters):
1. GEO Fundamentals — `geo-fundamentals/`
2. China AI Ecosystem — `china-ai-ecosystem/`
3. World-to-China — `world-to-china/`
4. China-to-World — `china-to-world/`

URL structure follows `/{pillar-slug}/{spoke-slug}/{detail-slug}/`. The complete URL-to-file mapping is in `docs/articles/SITEMAP.md`.

## Design Prototype (source/app/)

The React/Vite app in `source/app/` is a **reference design** — use it to understand the intended visual design when building Astro pages. Key patterns:

- **Bilingual**: `LanguageContext.tsx` holds all EN/ZH strings via a `t(key)` function. When building Astro pages, replicate this i18n approach appropriate to Astro's i18n patterns.
- **Sections**: `Navigation`, `HeroSection`, `CoreThesisSection`, `ArticleIndexSection`, `InsightsArchiveSection`, `LLMConstellation` (Three.js WebGL), `FooterSection`
- **UI components**: shadcn/ui (New York style, slate base) — all in `source/app/src/components/ui/`. Path alias `@/` maps to `source/app/src/`.
- **Animation**: GSAP (`gsap`) for scroll/entrance animations; Three.js + `postprocessing` for the LLM constellation WebGL element.

## Key Domain Context

**GEO** (Generative Engine Optimization) targets AI citations rather than search rankings. Core KPIs: Citation Rate, Share of Model (SoM), AI-Referred Traffic. The site's thesis is that content must be structured for "extractability" by LLMs.

**China AI "Big Six"** referenced throughout the content: Doubao (ByteDance), DeepSeek, Qwen (Alibaba), Kimi (Moonshot), Yuanbao (Tencent), Baidu AI/Ernie Bot.
