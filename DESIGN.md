# GEO Website — Design System

## Overview
This document captures the design language extracted from the original React implementation for consistent implementation in Astro.

## Typography
- **Primary**: Inter (weights 300–900)
- **Display / Headings**: Inter with `font-display` class (weight 800, letter-spacing -0.04em)
- **Serif accent**: Playfair Display (used for quotes or emphasis)
- **Mono**: JetBrains Mono (for code, stats, labels)

## Color Palette (HSL)
```css
--background: 0 0% 2%;          /* #050505 */
--foreground: 0 0% 100%;
--card: 0 0% 6.7%;              /* #111111 */
--border: 0 0% 15%;
--accent: 217 91% 60%;          /* #3b82f6 (blue) */
--muted-foreground: 0 0% 63%;
```

## Key Visual Elements
- **Hero**: Deep black background (`#050505`), large bold typography, minimal
- **Navigation**: Clean, underline hover effect (`nav-link-underline`)
- **Cards**: Subtle dark cards with thin borders
- **Sections**: Generous vertical spacing (py-20 / py-24)
- **Accent**: Strong use of the blue accent (`#3b82f6`) for CTAs and highlights

## Component Patterns (from React)
- `Navigation.tsx`
- `HeroSection.tsx`
- `CoreThesisSection.tsx`
- `ArticleIndexSection.tsx`
- `InsightsArchiveSection.tsx`
- `FooterSection.tsx`

## Content Philosophy (GEO-aligned)
- High contrast
- Excellent readability
- Structured content (headings, lists, tables)
- Authoritative tone
- First-hand / original insights prioritized

## Images & Media
- Use high-quality, minimal imagery
- Prefer illustrations over photos when possible
- All images should have descriptive alt text

## Breakpoints
Standard Tailwind: `sm`, `md`, `lg`, `xl`

---
*Extracted from React implementation on 2026-06-06*