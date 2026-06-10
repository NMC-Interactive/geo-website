# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Playbook Loop Layer

This repo runs on an **Agent-Playbook** loop. The master is `playbook.yaml` (the fixation), and `SKILL.md` teaches how to operate it. Work the loop: **orient → select → act → verify → record → report**.

```bash
node scripts/pb.mjs status        # orient (backlog + journal + guardrail state)
node scripts/pb.mjs next --claim  # pick + claim the next task
node scripts/pb.mjs validate      # playbook guardrails (also: npm run validate:site)
node scripts/pb.mjs record --task <id> --action <a> --status <done|blocked> --notes "..."
node scripts/pb.mjs report        # roll the journal up into artifacts/reports/
```

The backlog lives in `memory/backlog.yaml`; the machine record in `memory/journal.ndjson` (append via `pb record`, never hand-edit).

## Required Startup Rules

1. Read `playbook.yaml` and `SKILL.md`, then run `node scripts/pb.mjs status` to orient.
2. Read `PROJECT-MEMORY.md` first for durable repo rules.
3. Check repo-local skills in `skills/` before starting ad hoc work.
4. Follow the canonical process files in `processes/`.
5. If `PROJECT-MEMORY.md` changes materially, keep this file aligned with it.

## Canonical Process And Skills Layer

Canonical process files:
- `processes/index.json`
- `processes/create-page.json`
- `processes/deployment.json`

Repo-local skills:
- `skills/agent-handoff-skill/SKILL.md`
- `skills/create-page/SKILL.md`
- `skills/deployment/SKILL.md`

Operational rule:
- prefer the skills-first approach for page creation, deployment, and handoff workflows
- only fall back to direct ad hoc execution when no matching repo-local skill exists

## Project Overview

A 100+ page **GEO (Generative Engine Optimization)** intelligence website covering bidirectional GEO strategy between global and Chinese AI markets. The site is organized around a **Dual-Track** theme: World-to-China and China-to-World.

## Repository Layout

```
/                        ← Astro production project (canonical)
  src/
    pages/               ← File-based routing (.astro files)
    layouts/             ← Layout.astro (base), DocsLayout.astro (content)
    content.config.ts    ← Astro Content Collections schema
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

  docs/                  ← Design, planning, and editorial reference
    articles/
      SITEMAP.md         ← Planned URL map with linking structure
    master-layout-design.pen
  src/content/docs/      ← Canonical live content source
  src/data/bio.json      ← Author identity source
  PROJECT-MEMORY.md      ← Durable operating memory
  processes/             ← Canonical workflow definitions
  skills/                ← Repo-local workflow skills
```

## Commands

All Astro commands run from the **project root**:

```bash
npm run dev        # Start Astro dev server
npm run build      # Production build
npm run validate:site  # Validate build output, sitemap, robots, metadata, and domain
npm run predeploy  # Build + validate
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

**Stack**: Astro 6.x + React integration + Tailwind CSS 3.x

**Routing**: File-based under `src/pages/`. Current pages:
- `/` → `src/pages/index.astro`
- `/sitemap` → `src/pages/sitemap.astro`
- `/sitemap.xml` → generated from `src/pages/sitemap.xml.ts`
- `/robots.txt` → generated from `src/pages/robots.txt.ts`
- `/llms.txt` → generated from `src/pages/llms.txt.ts`
- `src/pages/docs/*` routes are legacy redirect surfaces, not the canonical public structure

**Layouts**:
- `Layout.astro` — base shell (head, body, slot)
- `DocsLayout.astro` — content pages with GEO metadata and article shell

**Content Collections** (`src/content.config.ts`): The `docs` collection schema is the canonical live content model.

**Production domain**: `https://geo.nmc-interactive.com`

**Cloudflare Pages property**: `geo`

**Publishing rule**:
- push to `preview` publishes preview
- push to `main` publishes live

## Content Architecture

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

Canonical live route families:
- `/geo-fundamentals/...`
- `/china-ai-ecosystem/...`
- `/world-to-china/...`
- `/world-to-china-geo/`
- `/china-to-world/...`
- `/china-to-world-geo/`

Sitemap parity rule:
- keep `docs/articles/SITEMAP.md`
- `dist/sitemap`
- `dist/sitemap.xml`
- `dist/sitemap/index.html`
in sync whenever page inventory changes

## Design Sources

Primary layout source of truth:
- `docs/master-layout-design.pen`
- `DESIGN.md`

The React/Vite app in `source/app/` is a secondary reference design, not the primary layout authority. Key patterns:

- **Bilingual**: `LanguageContext.tsx` holds all EN/ZH strings via a `t(key)` function. When building Astro pages, replicate this i18n approach appropriate to Astro's i18n patterns.
- **Sections**: `Navigation`, `HeroSection`, `CoreThesisSection`, `ArticleIndexSection`, `InsightsArchiveSection`, `LLMConstellation` (Three.js WebGL), `FooterSection`
- **UI components**: shadcn/ui (New York style, slate base) — all in `source/app/src/components/ui/`. Path alias `@/` maps to `source/app/src/`.
- **Animation**: GSAP (`gsap`) for scroll/entrance animations; Three.js + `postprocessing` for the LLM constellation WebGL element.

## Key Domain Context

**GEO** (Generative Engine Optimization) targets AI citations rather than search rankings. Core KPIs: Citation Rate, Share of Model (SoM), AI-Referred Traffic. The site's thesis is that content must be structured for "extractability" by LLMs.

**China AI "Big Six"** referenced throughout the content: Doubao (ByteDance), DeepSeek, Qwen (Alibaba), Kimi (Moonshot), Yuanbao (Tencent), Baidu AI/Ernie Bot.

## Mandatory Page Creation Rule

New pages must be GEO-planned before implementation.

Minimum expectations:
- clear retrieval intent
- canonical cluster placement
- entity-aware framing
- answer-ready structure
- source and citation planning
- visible trust and authorship strategy
- internal linking plan
- metadata and schema readiness

Default author workflow:
- use `src/data/bio.json`
- default to `River Ho` unless a different author is intentionally added
