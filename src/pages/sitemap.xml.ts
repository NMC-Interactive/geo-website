import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { flattenCanonicalUrls, getUtilityPages } from '../utils/content-index';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function toDateString(value: Date | undefined): string | undefined {
  return value ? value.toISOString().slice(0, 10) : undefined;
}

export const GET: APIRoute = async ({ site, url }) => {
  const docs = await getCollection('docs');
  const origin = (site ?? url).origin;

  // Freshness signal: newest content update drives the utility pages' lastmod.
  const newest = docs.reduce<Date | undefined>((max, entry) => {
    const candidate = entry.data.updatedDate ?? entry.data.pubDate;
    if (!candidate) return max;
    return max && max > candidate ? max : candidate;
  }, undefined);
  const siteLastmod = toDateString(newest);

  const lastmodByUrl = new Map(
    docs.map((entry) => [entry.data.url, toDateString(entry.data.updatedDate ?? entry.data.pubDate)]),
  );

  const urls: Array<{ path: string; lastmod?: string }> = [
    ...getUtilityPages().map((page) => ({ path: page.url, lastmod: siteLastmod })),
    ...flattenCanonicalUrls(docs).map((path) => ({ path, lastmod: lastmodByUrl.get(path) })),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, origin).href);
      const lastmodTag = lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : '';
      return `<url><loc>${loc}</loc>${lastmodTag}</url>`;
    }),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
