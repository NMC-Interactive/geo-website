import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildLlmsTxt } from '../utils/content-index';

// Complete AI index: every published page (pillars, spokes, details) with
// short descriptions. /llms.txt remains the curated entry point.
export const GET: APIRoute = async ({ site, url }) => {
  const docs = await getCollection('docs');
  const origin = (site ?? url).origin;

  return new Response(buildLlmsTxt(docs, origin, true), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
