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

export const GET: APIRoute = async ({ site, url }) => {
  const docs = await getCollection('docs');
  const origin = (site ?? url).origin;
  const pageUrls = [
    ...getUtilityPages().map((page) => page.url),
    ...flattenCanonicalUrls(docs),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pageUrls.map((path) => {
      const loc = escapeXml(new URL(path, origin).href);
      return `<url><loc>${loc}</loc></url>`;
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
