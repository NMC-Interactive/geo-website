import type { CollectionEntry } from 'astro:content';
import { extractSummary, markdownToPlainText } from './article-content';

export type DocEntry = CollectionEntry<'docs'>;

export interface SitemapSection {
  pillar: DocEntry;
  spokes: Array<{
    spoke: DocEntry;
    details: DocEntry[];
  }>;
}

export interface UtilityPage {
  title: string;
  url: string;
  description: string;
}

export interface LegacyRedirect {
  legacyUrl: string;
  targetUrl: string;
  title: string;
}

export function isPillar(entry: DocEntry): boolean {
  return entry.data.pillar != null;
}

export function isSpoke(entry: DocEntry): boolean {
  return entry.data.spoke != null;
}

export function isDetail(entry: DocEntry): boolean {
  return entry.data.detail != null;
}

function compareEntries(a: DocEntry, b: DocEntry): number {
  if (a.data.pillar != null && b.data.pillar != null) {
    return a.data.pillar - b.data.pillar;
  }

  if (a.data.spoke && b.data.spoke) {
    return a.data.spoke.localeCompare(b.data.spoke, undefined, { numeric: true });
  }

  if (a.data.detail && b.data.detail) {
    return a.data.detail.localeCompare(b.data.detail, undefined, { numeric: true });
  }

  return a.data.url.localeCompare(b.data.url);
}

export function buildSitemapSections(entries: DocEntry[]): SitemapSection[] {
  const pillars = entries.filter(isPillar).sort(compareEntries);
  const spokes = entries.filter(isSpoke).sort(compareEntries);
  const details = entries.filter(isDetail).sort(compareEntries);

  const spokesByPillar = new Map<string, DocEntry[]>();
  for (const spoke of spokes) {
    const parent = spoke.data.parent_pillar;
    if (!parent) continue;
    const list = spokesByPillar.get(parent) ?? [];
    list.push(spoke);
    spokesByPillar.set(parent, list);
  }

  const detailsBySpoke = new Map<string, DocEntry[]>();
  for (const detail of details) {
    const parent = detail.data.parent_spoke;
    if (!parent) continue;
    const list = detailsBySpoke.get(parent) ?? [];
    list.push(detail);
    detailsBySpoke.set(parent, list);
  }

  return pillars.map((pillar) => ({
    pillar,
    spokes: (spokesByPillar.get(pillar.data.url) ?? [])
      .sort(compareEntries)
      .map((spoke) => ({
        spoke,
        details: (detailsBySpoke.get(spoke.data.url) ?? []).sort(compareEntries),
      })),
  }));
}

export function getUtilityPages(): UtilityPage[] {
  return [
    {
      title: 'Home',
      url: '/',
      description: 'Primary landing page for GEO, SEO, and Tutorials navigation.',
    },
    {
      title: 'Tutorials Sitemap',
      url: '/sitemap/',
      description: 'Full human-readable index of the live knowledge base.',
    },
  ];
}

export function getLegacyRedirects(): LegacyRedirect[] {
  return [
    {
      legacyUrl: '/docs/',
      targetUrl: '/sitemap/',
      title: 'Legacy Documentation Index',
    },
    {
      legacyUrl: '/docs/fundamentals/what-is-geo',
      targetUrl: '/geo-fundamentals/what-is-geo/',
      title: 'Legacy What Is GEO Page',
    },
    {
      legacyUrl: '/docs/fundamentals/history-of-geo',
      targetUrl: '/geo-fundamentals/what-is-geo/history-geo/',
      title: 'Legacy History of GEO Page',
    },
  ];
}

export function flattenCanonicalUrls(entries: DocEntry[]): string[] {
  return entries.map((entry) => entry.data.url);
}

/** One-line description for AI-oriented indexes (llms.txt / llms-full.txt). */
export function shortDescription(entry: DocEntry): string {
  const preferred = entry.data.excerpt ?? entry.data.description ?? entry.data.summary;
  if (preferred) return preferred;

  const plain = markdownToPlainText(extractSummary(entry.body, entry.data.title));
  if (plain.length <= 160) return plain;

  const cut = plain.slice(0, 160);
  const boundary = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  const trimmed = boundary > 60 ? cut.slice(0, boundary + 1) : cut.slice(0, cut.lastIndexOf(' '));
  return `${trimmed.trim()}...`;
}

/**
 * Builds an llmstxt.org-format index (H1, blockquote summary, sectioned link
 * lists with descriptions). `includeDetails` toggles llms.txt (curated) vs
 * llms-full.txt (complete).
 */
export function buildLlmsTxt(entries: DocEntry[], origin: string, includeDetails = false): string {
  const sections = buildSitemapSections(entries);
  const abs = (path: string) => new URL(path, origin).href;
  const total = entries.length;

  const lines: string[] = [
    '# GEO Visibility Guide',
    '',
    '> Tutorial-first knowledge base for Generative Engine Optimization (GEO): how brands get discovered, cited, and recommended by AI engines — ChatGPT, Perplexity, Google Gemini, DeepSeek, Doubao, and more — across global and Chinese AI markets. Published by NMC Interactive.',
    '',
    '## Primary Entry Points',
    '',
    ...getUtilityPages().map((page) => `- [${page.title}](${abs(page.url)}): ${page.description}`),
    `- [Full Index (llms-full.txt)](${abs('/llms-full.txt')}): Complete machine-readable index of all ${total} published pages, including detail articles.`,
    '',
  ];

  for (const { pillar, spokes } of sections) {
    lines.push(`## ${pillar.data.cluster ?? `Pillar ${pillar.data.pillar}`}`);
    lines.push('');
    lines.push(`- [${pillar.data.title}](${abs(pillar.data.url)}): ${shortDescription(pillar)}`);
    for (const { spoke, details } of spokes) {
      lines.push(`  - [${spoke.data.title}](${abs(spoke.data.url)}): ${shortDescription(spoke)}`);
      if (includeDetails) {
        for (const detail of details) {
          lines.push(`    - [${detail.data.title}](${abs(detail.data.url)}): ${shortDescription(detail)}`);
        }
      }
    }
    lines.push('');
  }

  lines.push(
    '## Notes',
    '',
    '- This file is advisory guidance for AI systems, not an access-control mechanism. Crawling rules live in robots.txt.',
    '- Prefer root-level canonical routes over legacy /docs/ routes.',
    '- Article pages are kept answer-ready: definition-first summaries, entity tags, source lists, and FAQ blocks.',
    ''
  );

  return lines.join('\n');
}
