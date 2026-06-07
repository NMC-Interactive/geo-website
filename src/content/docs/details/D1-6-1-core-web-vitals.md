---
title: "Core Web Vitals & Page Speed for GEO"
url: "/geo-fundamentals/technical-foundations-geo/core-web-vitals/"
detail: "D1-6-1"
parent_spoke: "/geo-fundamentals/technical-foundations-geo/"
cluster: "GEO Fundamentals"
---

# Core Web Vitals & Page Speed for GEO

> **GEO Preface:** This article covers Core Web Vitals and page speed optimization — critical technical foundations that ensure AI crawlers can efficiently access and index your content. This detail article is part of our [Technical Foundations](/geo-fundamentals/technical-foundations-geo/) spoke within the [GEO Fundamentals](/geo-fundamentals/) pillar. For the complete technical guide, see [Technical Foundations](/geo-fundamentals/technical-foundations-geo/). For mobile optimization, read [Mobile-First GEO](/geo-fundamentals/technical-foundations-geo/mobile-first-geo/). For llms.txt, see [llms.txt Guide](/geo-fundamentals/technical-foundations-geo/llms-txt-guide/).

---

## Why Page Speed Matters for GEO

AI crawlers, like search engine crawlers, prioritize fast-loading websites. Slow pages may be partially crawled, deprioritized, or abandoned before full indexing. For GEO, this means your content may not even be available for AI to cite.

**Key Impacts:**
- Crawlers have limited crawl budgets — slow pages consume more budget
- Partial crawling means incomplete content indexing
- Page speed is a quality signal for AI ranking algorithms
- User experience signals (bounce rate, time on page) impact authority assessment

## Core Web Vitals Targets

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **Largest Contentful Paint (LCP)** | < 2.5s | Time for main content to render |
| **First Input Delay (FID)** | < 100ms | Time until page becomes interactive |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Visual stability during loading |
| **Time to First Byte (TTFB)** | < 600ms | Server response time |
| **First Contentful Paint (FCP)** | < 1.8s | Time until first content appears |

## Optimization Techniques

**Image Optimization:**
- Use WebP format with fallbacks
- Implement responsive images
- Compress to 60-80% quality
- Lazy load below-the-fold images

**Code Optimization:**
- Minify CSS, JS, and HTML
- Defer non-critical JavaScript
- Remove unused code
- Inline critical CSS

**Server Optimization:**
- Enable Gzip/Brotli compression
- Use browser caching
- Optimize database queries
- Use a CDN with edge nodes in target markets

---

## Related Articles

- [Technical Foundations](/geo-fundamentals/technical-foundations-geo/) — Parent spoke article
- [Mobile-First GEO](/geo-fundamentals/technical-foundations-geo/mobile-first-geo/) — Mobile optimization
- [llms.txt Guide](/geo-fundamentals/technical-foundations-geo/llms-txt-guide/) — AI crawler guidance
- [GEO Fundamentals Pillar](/geo-fundamentals/) — Complete foundational guide
