import type { CollectionEntry } from 'astro:content';

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
