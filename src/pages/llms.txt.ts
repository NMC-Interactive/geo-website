import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { buildLlmsTxt } from '../utils/content-index';

// Curated AI index (llmstxt.org format): H1, blockquote summary, sectioned
// link lists with short descriptions. Pillars + spokes only; the complete
// index lives at /llms-full.txt.
export const GET: APIRoute = async ({ site, url }) => {
  const docs = await getCollection('docs');
  const origin = (site ?? url).origin;

  return new Response(buildLlmsTxt(docs, origin, false), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
